import { ServerUrlProvider } from './UrlProvider';
import { FileDataList } from "../types/FileDataList";
import { ServerStats, Item, ApiResponse, StorageLocation, thumbnailVersions } from '@/app/types/Types'

const API_BASE_URL = ServerUrlProvider();

export const ServerRequest = {

  async fetchFiles(page?: number, performerId?: number, sortBy?: string, unassignedOnly?: boolean): Promise<FileDataList> {

    let baseURL = API_BASE_URL || window.location.origin

    let url = new URL("/server/files", baseURL);
    if (page) {
      url.searchParams.append("page", page.toString());
    }
    if (performerId) {
      url.searchParams.append("performerId", performerId.toString());
    }
    if (sortBy) {
      url.searchParams.append("sortBy", sortBy);
    }
    if (unassignedOnly) {
      url.searchParams.append("unassigned", "true");
    }
    const response = await fetch(url, { method: "GET", redirect: "follow", cache: "no-store" });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`No files found on page ${page}`);
      }
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Failed to fetch files");
    }
    return await response.json();

  },



  // Image bytes are fetched by <img> tags directly so the browser's HTTP
  // cache and off-thread decoding handle them; these only build the URLs.
  thumbnailUrl(fileId: number): string {
    const url = new URL("/server/thumbnail", API_BASE_URL || window.location.origin);
    url.searchParams.append("fileId", fileId.toString());
    const version = thumbnailVersions.get(fileId);
    if (version) {
      url.searchParams.append("v", version.toString());
    }
    return url.toString();
  },

  gifPreviewUrl(fileId: number): string {
    return new URL(`/server/file/${fileId}/gif`, API_BASE_URL || window.location.origin).toString();
  },

  async extractThumbnail(fileId: string | number, timestampMs: number, token: string): Promise<Blob> {
    const url = new URL(`${API_BASE_URL}/server/thumbnail/extract`);
    url.searchParams.append("fileId", fileId.toString());
    url.searchParams.append("timestamp", Math.floor(timestampMs).toString());

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: "include"
    });

    if (!response.ok) {
      let defaultErrorMessage = "Thumbnail extraction failed";
      if (response.status === 401) {
        defaultErrorMessage = "Unauthorized";
      }
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || defaultErrorMessage);
    }
    
    return await response.blob();
  },
  async getUploadStatus(fileName: string, fileSize: number, chunkSize: number, target: StorageLocation, token: string): Promise<any> {
    try {
      const url = new URL(`${API_BASE_URL}/server/file/status`);
      url.searchParams.append("fileName", fileName);
      url.searchParams.append("fileSize", fileSize.toString());
      url.searchParams.append("chunkSize", chunkSize.toString());
      url.searchParams.append("target", target);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok && response.status !== 409) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || `Server returned ${response.status}`);
      }
      return await response.json();
    } catch (e) {
      console.error("[ServerRequest] getUploadStatus failed:", e);
      throw e;
    }
  },

  async uploadChunk(chunk: Blob, chunkIndex: number, totalChunks: number, fileName: string, fileSize: number, chunkSize: number, target: StorageLocation, token: string, passXMLObj: (xhr: XMLHttpRequest) => void): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = new URL(`${API_BASE_URL}/server/file/chunk`);
      url.searchParams.append("chunkIndex", chunkIndex.toString());
      url.searchParams.append("totalChunks", totalChunks.toString());
      url.searchParams.append("fileName", fileName);
      url.searchParams.append("fileSize", fileSize.toString());
      url.searchParams.append("chunkSize", chunkSize.toString());
      url.searchParams.append("target", target);

      const xhr = new XMLHttpRequest();
      passXMLObj(xhr);
      xhr.responseType = 'json';
      xhr.open('POST', url.toString(), true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');

      xhr.onerror = function () {
        reject(new Error(`Failed to upload chunk ${chunkIndex}`));
      };

      xhr.onload = function () {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          const response = xhr.response;
          reject(new Error(response?.message || `Upload failed for chunk ${chunkIndex} with status ${xhr.status}`));
        }
      };

      xhr.send(chunk);
    });
  },
  async fetchStats(signal: AbortSignal): Promise<ServerStats> {
    const response = await fetch(`${API_BASE_URL}/server/stats`, { signal });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Failed to fetch file stats");
    }
    const data = await response.json();

    const responseContent = {
      files: data.files,
      freeInternal: data.freeInternal,
      totalInternal: data.totalInternal,
      freeExternal: data.freeExternal,
      totalExternal: data.totalExternal,
      hasExternalStorage: data.hasExternalStorage,
      percentage: data.percentage ?? -1,
      charging: data.charging ?? false
    }
    return responseContent
  },
  async fetchfileDetails(fileId: string, signal?: AbortSignal): Promise<{ id: number, name: string, performers: Item[] }> {

    const response = await fetch(`${API_BASE_URL}/server/fileDetails/${fileId}`, { signal });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Failed to fetch file details");
    }
    const data = await response.json();
    // removing file extension
    let name = data.name.replace(/\.[a-zA-Z0-9]+$/, "")
    return { id: data.id, name: name, performers: data.performers }

  },
  async getActiveServersList(signal: AbortSignal): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      let result: string[] = [];
      try {
        const response = await fetch(`${API_BASE_URL}/server/servers`, { signal });
        if (!response.ok) {
          const error = await response.json().catch(() => null);
          reject(new Error(error?.message || "Failed to fetch server list"));
          return;
        }
        let data = await response.json();
        if (typeof data === 'object' && data !== null && data.activeServers !== undefined && Array.isArray(data.activeServers)) {
          resolve(data.activeServers);
          return;
        }
        resolve(result);
      } catch (error: any) {
        if (error instanceof Error) {
          if (error.message === "Failed to fetch") {
            reject(new Error("Server is unreachable."));

          } else {
            reject(error);
          }
        }
      }
    });
  },

  async deleteVideo(fileId: string, token: string): Promise<void> {

    const response = await fetch(`${API_BASE_URL}/server/file?fileId=${fileId}`,
      {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: "include"
      });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Failed to delete the file");
    }
  },

  async updateFileName(fileId: string, newName: string, token: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/server/file/${fileId}/rename`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify({ newName }),
    });
    if (response.status === 401) {
      throw new Error("Unauthorized access");
    }
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Failed to update item");
    }
    return await response.json();
  }


};
