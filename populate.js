import fs from 'fs';
import { glob } from 'glob'; // Use the named export 'glob' from the 'glob' package

// Define the links to ignore in the description
const linksToIgnore = [
    "https://discord.gg/tH8wEpNKWS",
    "https://linktr.ee/TheLaluka"
];

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

// Main function to glob all JSON files, process them, sort by date, and write to a single JSON file
async function main() {
    const files = await glob('metadatas/*.json'); // Use 'await' since glob returns a promise
    var videos = files.map(processFile);
    // Filter out videos with no upload date
    console.log(videos.length);
    videos = videos.filter(video => video.upload_date);
    console.log(videos.length);
    // Sort videos by upload_date in descending order (newest first)
    videos.sort((a, b) => b.upload_date.localeCompare(a.upload_date));

    // Write the sorted videos to a single JSON file
    fs.writeFileSync('src/all_videos.json', JSON.stringify(videos, null, 2));
    console.log('All videos have been processed and saved to src/all_videos.json');
}

main();