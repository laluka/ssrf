import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const METADATA_DIR = path.join(ROOT, 'metadatas');
const OUTPUT = path.join(ROOT, 'src/all_videos.json');
const CHANNEL_URL = 'https://www.youtube.com/@TheLaluka';
const IGNORED_LINKS = new Set([
  'https://discord.gg/tH8wEpNKWS',
  'https://linktr.ee/TheLaluka',
]);

export function extractVideoId(value) {
  try {
    const url = new URL(value);
    const id = url.searchParams.get('v') ?? url.pathname.split('/').filter(Boolean).at(-1);
    return /^[\w-]{11}$/.test(id ?? '') ? id : null;
  } catch {
    return null;
  }
}

export function flattenEntries(playlist) {
  return playlist.entries ? playlist.entries.filter(Boolean).flatMap(flattenEntries) : [playlist];
}

export function toVideo(data) {
  if (!/^[\w-]{11}$/.test(data.id ?? '') || typeof data.title !== 'string') {
    throw new Error('Metadata must contain a valid video ID and title');
  }
  if (!/^\d{8}$/.test(data.upload_date ?? '')) return null;
  const links = (data.description ?? '').match(/https?:\/\/[^\s<>[\]"']+/g) ?? [];
  return {
    id: data.id,
    title: data.title,
    links: [...new Set(links.filter(link => !IGNORED_LINKS.has(link)))],
    webpage_url: `https://www.youtube.com/watch?v=${data.id}`,
    upload_date: data.upload_date,
  };
}

function runYtDlp(args) {
  return JSON.parse(execFileSync(process.env.YT_DLP_BIN || 'yt-dlp', [
    '--js-runtimes', `node:${process.execPath}`, ...args,
  ], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    timeout: 180_000,
    stdio: ['ignore', 'pipe', 'inherit'],
  }));
}

export function main(args = process.argv.slice(2)) {
  if (args.some(arg => !['--offline', '--refresh'].includes(arg)) ||
      (args.includes('--offline') && args.includes('--refresh'))) {
    throw new Error('Usage: node populate.js [--offline | --refresh]');
  }
  fs.mkdirSync(METADATA_DIR, { recursive: true });
  const cache = new Map();
  for (const filename of fs.readdirSync(METADATA_DIR).filter(name => name.endsWith('.info.json')).sort()) {
    const file = path.join(METADATA_DIR, filename);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    toVideo(data);
    cache.set(data.id, { file, data });
  }

  if (!args.includes('--offline')) {
    console.log('Fetching video list from channel...');
    const playlist = runYtDlp(['--flat-playlist', '--dump-single-json', CHANNEL_URL]);
    const ids = [...new Set(flattenEntries(playlist)
      .map(entry => extractVideoId(entry.url ?? entry.webpage_url ?? ''))
      .filter(Boolean))];
    if (!ids.length) throw new Error('The channel returned no video IDs; refusing to publish an incomplete update');
    const pending = ids.filter(id => args.includes('--refresh') || !cache.has(id) || !cache.get(id).data.upload_date);
    console.log(`Channel videos: ${ids.length}; metadata to fetch: ${pending.length}`);
    const failures = [];
    for (const [index, id] of pending.entries()) {
      console.log(`Fetching metadata ${index + 1}/${pending.length}: ${id}`);
      try {
        const raw = runYtDlp(['--skip-download', '--ignore-no-formats-error', '--dump-single-json',
          `https://www.youtube.com/watch?v=${id}`]);
        const data = {
          id: raw.id, title: raw.title, description: raw.description ?? '',
          webpage_url: `https://www.youtube.com/watch?v=${id}`, upload_date: raw.upload_date,
        };
        if (data.id !== id) throw new Error('Fetched metadata has an unexpected video ID');
        toVideo(data);
        const file = cache.get(id)?.file ?? path.join(METADATA_DIR, `${id}.info.json`);
        fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
        cache.set(id, { file, data });
      } catch (error) {
        console.error(`Failed to fetch ${id}: ${error.message}`);
        failures.push(id);
      }
    }
    if (failures.length) throw new Error(`Metadata fetch failed for ${failures.length} videos; retry before publishing`);
  }

  const videos = [...cache.values()].map(({ data }) => toVideo(data)).filter(Boolean);
  videos.sort((a, b) => b.upload_date.localeCompare(a.upload_date) || a.id.localeCompare(b.id));
  if (!videos.length) throw new Error('No dated videos found; refusing to overwrite the database');
  fs.writeFileSync(OUTPUT, `${JSON.stringify(videos, null, 2)}\n`);
  console.log(`Saved ${videos.length} videos to src/all_videos.json`);
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
