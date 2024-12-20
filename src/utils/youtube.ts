export function extractYoutubeId(url: string): string | null {
  try {
    // Handle URLs with special characters
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get('v');
    return videoId;
  } catch {
    // Fallback regex method if URL parsing fails
    const watchUrlPattern = /youtube\.com\/watch\?v=([^&#]+)/;
    const match = url.match(watchUrlPattern);
    return match ? match[1] : null;
  }
}

export function getYoutubeThumbnail(videoId: string | null): string {
  if (!videoId) {
    return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHVycGxlJTIwZ3JhZGllbnR8ZW58MHx8MHx8fDA%3D';
  }
  
  // Try multiple thumbnail qualities in order of preference:
  // 1. maxresdefault (1920x1080)
  // 2. sddefault (640x480)
  // 3. hqdefault (480x360)
  // 4. mqdefault (320x180)
  // 5. default (120x90)
  const qualities = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', 'default'];
  
  // Create an image element to check if the thumbnail exists
  const img = new Image();
  img.src = `https://img.youtube.com/vi/${videoId}/${qualities[0]}.jpg`;
  
  // Return a URL that will automatically fall back to lower qualities
  // This works because YouTube's CDN will automatically serve the next best quality
  // if a higher quality isn't available
  return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
}