
export interface Item {
  id: number;
  name: string;
}

export interface ItemWithCount extends Item {
  count: number;
}

// Define the structure of a Performer
export interface Performer extends Item {

}

// Define the structure of a Category
export interface Category extends Item {

}

export interface NetworkReturn {
  message: string
}

export interface ServerStats {
  files: number,
  freeInternal: number,
  totalInternal: number,
  freeExternal: number,
  totalExternal: number,
  hasExternalStorage: boolean,
  percentage: number,
  charging: boolean
}

export interface ToastMessageDetails {
  message: string;
  type: MessageType;
}

export enum MessageType {
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
}

export enum EntityType {
  Category = "category",
  Performer = "performer",
}

export interface ToastData {
  id: number;
  message: string;
  type: MessageType;
}

export interface CardProps {
  showToast: (toastDetails: ToastMessageDetails) => void
}

export interface ApiResponse {
  message: string;
  items?: Item[];
}

export interface FileDetails {
  id: number;
  name: string;
  thumbnailUpdatedAt?: number;
  performers: Item[];
}

export interface HomeProps {
  searchParams: {
    page?: string;
    performerId?: string;
  };
}

export enum StorageLocation {
  Internal = 'internal',
  External = 'external',
}

export type HomeSearchParams = Promise<{ page: string | undefined, performerId: string | undefined, sortBy: string | undefined, unassigned: string | undefined }>


const thumbnailUpdatedAtOverrides = new Map<number, number>();

export function noteThumbnailUpdated(fileId: number, updatedAt: number): void {
  if (!Number.isFinite(updatedAt) || updatedAt <= 0) return;
  thumbnailUpdatedAtOverrides.set(fileId, updatedAt);
}

export function resolveThumbnailUpdatedAt(fileId: number, updatedAt?: number): number {
  return Math.max(updatedAt ?? 0, thumbnailUpdatedAtOverrides.get(fileId) ?? 0);
}