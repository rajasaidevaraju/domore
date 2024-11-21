var API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
const NEXT_IS_DEPLOYMENT_static= process.env.NEXT_IS_DEPLOYMENT_static;
import { FileDataList } from "../types/FileDataList";
export const ServerRequest = {
  async fetchFiles(page?:number): Promise<FileDataList> {
    try {
      let url=`${API_BASE_URL}/server/files`
      if(page!=undefined){
        url=`${API_BASE_URL}/server/files/page/${page}`
      }
      console.log(url)
      const response = await fetch(url,{method:"GET",redirect:"follow"});
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
      return { imageData: "", exists: false }
    }
    return await response.json();
  }
};