var API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
const NEXT_PUBLIC_IS_DEVELOPMENT= process.env.NEXT_PUBLIC_IS_DEVELOPMENT;

if(NEXT_PUBLIC_IS_DEVELOPMENT!='true'){
    API_BASE_URL=`http://${window.location.host}:1280`;
}

export const ServerRequest = {
  async fetchFiles(): Promise<{ fileId: number; fileName: string }[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/server/files`);
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch files');
    }
  },

  async sendScreenshot(fileId: string, imageData: string) {
    let requestBody = JSON.stringify({ fileId, imageData });

    const response = await fetch(`${API_BASE_URL}/server/upload-screenshot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });
    if (!response.ok) {
      throw new Error(`status ${response.status} from server`);
    }
    return await response.json();
  },

  async requestThumbnail(fileId: string): Promise<{ imageData: string, exists: boolean }> {
    const response = await fetch(`${API_BASE_URL}/server/thumbnail?fileId=${fileId}`);
    if (!response.ok) {
      throw new Error(`status ${response.status} from server`);
    }
    return await response.json();
  }
};