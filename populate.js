import fs from 'fs';
import { execSync } from 'child_process';
import { glob } from 'glob'; // Use the named export 'glob' from the 'glob' package

// Define the links to ignore in the description
const linksToIgnore = [
    "https://discord.gg/tH8wEpNKWS",
    "https://linktr.ee/TheLaluka"
];

const CHANNEL_URL = 'https://www.youtube.com/@TheLaluka';
const METADATAS_DIR = 'metadatas';

// Function to extract video ID from YouTube URL
function extractVideoId(url) {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
}

// Function to check if metadata file exists for a video ID
function hasMetadataFile(videoId) {
    const files = fs.readdirSync(METADATAS_DIR);
    const expectedSuffix = `[${videoId}].info.json`;
    return files.some(file => file.endsWith(expectedSuffix));
}

// Function to fetch video URLs from the channel
function fetchVideoUrls() {
    console.log('Fetching video URLs from channel...');
    try {
        const output = execSync(`yt-dlp -i --flat-playlist -g "${CHANNEL_URL}"`, {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe']
        });
        const urls = output.trim().split('\n').filter(url => url.trim().length > 0);
        console.log(`Found ${urls.length} video URLs`);
        return urls;
    } catch (error) {
        console.error('Error fetching video URLs:', error.message);
        throw error;
    }
}

// Function to fetch metadata for a video URL
function fetchVideoMetadata(url) {
    console.log(`Fetching metadata for: ${url}`);
    try {
        execSync(`yt-dlp --skip-download --write-info-json --paths ${METADATAS_DIR} "${url}"`, {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe']
        });
    } catch (error) {
        console.error(`Error fetching metadata for ${url}:`, error.message);
        // Continue with other videos even if one fails
    }
}

// Function to extract and filter links from the description
function getFilteredLinks(description) {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s<>\[\]"']+)/g;

    // Find all links in the description
    const links = description.match(urlRegex) || [];

    // Filter out unwanted links
    return links.filter(link => !linksToIgnore.includes(link));
}

// Function to process each JSON file
function processFile(filePath) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return {
        title: data.title,
        links: getFilteredLinks(data.description),
        webpage_url: data.webpage_url,
        upload_date: data.upload_date
    };
}

// Main function
async function main() {
    // Step 1: Fetch all video URLs from the channel
    const urls = fetchVideoUrls();

    // Step 2: Extract video IDs and identify which ones need metadata
    const videoIds = urls.map(url => extractVideoId(url)).filter(id => id !== null);
    const newVideos = videoIds.filter(id => !hasMetadataFile(id));

    console.log(`Total videos: ${videoIds.length}`);
    console.log(`Cached videos: ${videoIds.length - newVideos.length}`);
    console.log(`New videos to fetch: ${newVideos.length}`);

    // Step 3: Fetch metadata only for new videos
    if (newVideos.length > 0) {
        console.log('\nFetching metadata for new videos...');
        const newUrls = urls.filter(url => {
            const id = extractVideoId(url);
            return id && newVideos.includes(id);
        });

        for (const url of newUrls) {
            fetchVideoMetadata(url);
        }
        console.log('Finished fetching metadata for new videos.\n');
    } else {
        console.log('All videos are already cached.\n');
    }

    // Step 4: Process all metadata files and generate the output
    const files = await glob('metadatas/*.json');
    var videos = files.map(processFile);
    // Filter out videos with no upload date
    console.log(`Processing ${videos.length} metadata files...`);
    videos = videos.filter(video => video.upload_date);
    console.log(`${videos.length} videos have upload dates.`);
    // Sort videos by upload_date in descending order (newest first)
    videos.sort((a, b) => b.upload_date.localeCompare(a.upload_date));

    // Write the sorted videos to a single JSON file
    fs.writeFileSync('src/all_videos.json', JSON.stringify(videos, null, 2));
    console.log('All videos have been processed and saved to src/all_videos.json');
}

main();