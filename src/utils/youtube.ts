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

export async function getYoutubeThumbnail(videoId: string | null): Promise<string> {
  if (!videoId) {
    return 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png';
  }

  // Helper function to check if an image exists
  const checkImage = (url: string): Promise<boolean> => {
    return fetch(url, { method: 'HEAD' })
      .then((res) => res.ok)
      .catch(() => false);
  };

  const maxResUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const exists = await checkImage(maxResUrl);

  return exists ? maxResUrl : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
