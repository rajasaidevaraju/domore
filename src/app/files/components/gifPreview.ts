interface PreviewOwner {
  id: number;
  release: () => void;
}

let currentOwner: PreviewOwner | null = null;

export function claimGifPreview(id: number, release: () => void): void {
  if (currentOwner && currentOwner.id !== id) {
    currentOwner.release();
  }
  currentOwner = { id, release };
}

export function releaseGifPreview(id: number): void {
  if (currentOwner?.id === id) {
    currentOwner = null;
  }
}

const gifCache = new Map<number, Blob>();
const MAX_CACHED_GIFS = 30;

export function getCachedGif(id: number): Blob | undefined {
  return gifCache.get(id);
}

export function cacheGif(id: number, blob: Blob): void {
  gifCache.delete(id);
  gifCache.set(id, blob);
  while (gifCache.size > MAX_CACHED_GIFS) {
    const oldest = gifCache.keys().next().value;
    if (oldest === undefined) break;
    gifCache.delete(oldest);
  }
}
