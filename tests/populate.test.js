import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { extractVideoId, flattenEntries, toVideo } from '../populate.js';

const video = {
  id: 'abcdefghijk', title: 'Example episode', upload_date: '20261023',
  description: 'https://example.com https://example.com https://linktr.ee/TheLaluka',
};

test('imports watch, Shorts and short URLs, rejecting invalid IDs', () => {
  for (const url of [
    'https://www.youtube.com/watch?v=abcdefghijk&list=example',
    'https://www.youtube.com/shorts/abcdefghijk',
    'https://youtu.be/abcdefghijk',
  ]) assert.equal(extractVideoId(url), video.id);
  assert.equal(extractVideoId('not a URL'), null);
  assert.equal(extractVideoId('https://www.youtube.com/watch?v=invalid'), null);
});

test('flattens channel tabs and tolerates unavailable entries', () => {
  assert.deepEqual(flattenEntries({ entries: [{ entries: [null, video] }] }), [video]);
});

test('extracts unique resource links and skips undated videos', () => {
  assert.deepEqual(toVideo(video).links, ['https://example.com']);
  assert.equal(toVideo({ ...video, upload_date: undefined }), null);
  assert.deepEqual(toVideo({ ...video, description: undefined }).links, []);
  assert.throws(() => toVideo({ title: 'Missing ID' }), /valid video ID/);
});

test('offline builds are reproducible and failed fetches preserve the database', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ssrf-populate-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'metadatas'));
  fs.mkdirSync(path.join(root, 'src'));
  fs.copyFileSync(new URL('../populate.js', import.meta.url), path.join(root, 'populate.mjs'));
  fs.writeFileSync(path.join(root, 'metadatas/example.info.json'), JSON.stringify(video));
  const script = path.join(root, 'populate.mjs');
  const env = { ...process.env, YT_DLP_BIN: path.join(root, 'missing-yt-dlp') };
  execFileSync(process.execPath, [script, '--offline'], { env });
  const output = path.join(root, 'src/all_videos.json');
  const first = fs.readFileSync(output, 'utf8');
  assert.deepEqual(JSON.parse(first), [toVideo(video)]);
  execFileSync(process.execPath, [script, '--offline'], { env });
  assert.equal(fs.readFileSync(output, 'utf8'), first);
  assert.equal(spawnSync(process.execPath, [script], { env }).status, 1);
  assert.equal(fs.readFileSync(output, 'utf8'), first);
  assert.equal(spawnSync(process.execPath, [script, '--unknown'], { env }).status, 1);
});
