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
