export interface DestinationImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Optional client-approved responsive derivatives; no image service required. */
  srcSet?: string;
  thumbnailSrc?: string;
  fullSrc?: string;
}

export type DestinationMedia =
  | { type: 'video'; source: 'youtube' | 'file'; videoUrl: string; poster?: string }
  | { type: 'gallery'; images: readonly DestinationImage[] }
  | { type: 'placeholder' };

/** Existing exact-watch-URL validation and playback parameters, unchanged. */
export function featuredYouTubeEmbedUrl(value?: string): string | undefined {
  if (!value) return;
  try {
    const url = new URL(value);
    const id = url.searchParams.get('v');
    if (url.protocol !== 'https:' || url.hostname !== 'www.youtube.com' || url.port
      || url.username || url.password || url.pathname !== '/watch' || !id || !/^[\w-]{11}$/.test(id)) return;
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0`;
  } catch { return; }
}

/** Explicit editorial choice wins. Legacy video records keep their exact URLs. */
export function resolveDestinationMedia(story?: { media?: DestinationMedia; youtubeUrl?: string }, file?: { url: string }): DestinationMedia {
  if (story?.media) return story.media;
  if (story?.youtubeUrl && featuredYouTubeEmbedUrl(story.youtubeUrl)) {
    return { type: 'video', source: 'youtube', videoUrl: story.youtubeUrl };
  }
  if (file) return { type: 'video', source: 'file', videoUrl: file.url };
  return { type: 'placeholder' };
}

export function galleryIndex(index: number, count: number) {
  return count > 0 ? ((index % count) + count) % count : 0;
}

export function gallerySupportIndices(index: number, count: number) {
  return Array.from({ length: Math.min(2, Math.max(0, count - 1)) }, (_, offset) => galleryIndex(index + offset + 1, count));
}

/** Horizontal intent only; ordinary vertical sheet scrolling remains native. */
export function gallerySwipeStep(dx: number, dy: number) {
  return Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.3 ? (dx < 0 ? 1 : -1) : 0;
}
