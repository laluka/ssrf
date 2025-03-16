import { StreamData } from '../types';
import allVideos from '../all_videos.json';

interface VideoData {
  title: string;
  links: string[];
  webpage_url: string;
  upload_date: string;
}

// Format date from YYYYMMDD to YYYY-MM-DD
function formatDate(dateStr: string): string {
  if (dateStr.length === 8) {
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
  }
  return dateStr;
}

export async function fetchStreamData(): Promise<StreamData[]> {
  try {
    return (allVideos as VideoData[])
      .map((video) => ({
        date: formatDate(video.upload_date),
        covered_links: video.links, // Keep all links
        stream_name: video.title,
        stream_link: video.webpage_url,
      }))
      .filter((stream): stream is StreamData =>
        Boolean(
          stream.date && stream.covered_links.length > 0 && stream.stream_name && stream.stream_link
        )
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading stream data:', error);
    return [];
  }
}
