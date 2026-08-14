export function isYoutubeUrl(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be');
  } catch {
    return /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\//i.test(url);
  }
}

export function toEmbedUrl(url) {
  if (!url) return '';
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '').toLowerCase();

    if (host.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }

    if (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;

      const parts = u.pathname.split('/').filter(Boolean);
      if (parts.length) {
        const lastSegment = parts[parts.length - 1];
        return `https://www.youtube.com/embed/${lastSegment}`;
      }
    }

    return url;
  } catch (error) {
    return url.replace('watch?v=', 'embed/').replace('youtu.be/', 'https://www.youtube.com/embed/');
  }
}

export function isVideoUrl(url) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}
