var API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_ADDRESS??"";
const NEXT_IS_DEPLOYMENT_static= process.env.NEXT_IS_DEPLOYMENT_static;
import { resolve } from "path";
import { FileDataList } from "../types/FileDataList";

export const ServerRequest = {
  
  async fetchFiles(page?:number): Promise<FileDataList> {
    try {
      let url=`${API_BASE_URL}/server/files`
      if(page!=undefined){
        url=`${API_BASE_URL}/server/files?page=${page}`
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
  },
  async uploadFile(file: File|undefined, onProgress: (progress: number, speed: number) => void): Promise<any> {

    if (file) {
      const sizeInBytes = file.size; 
      const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
      console.log(`File size: ${sizeInMB} MB`);
      const formData = new FormData();
      formData.append('file', file);
   
      try {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${API_BASE_URL}/server/upload`, true);
          let lastTime = Date.now();
          let lastLoaded = 0;
          
          let progressTracker = function(event: ProgressEvent<EventTarget>) {
            if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100;
              // Calculate speed
              const currentTime = Date.now();
              const timeElapsed = (currentTime - lastTime) / 1000;
              const bytesTransferred = event.loaded - lastLoaded; 
              const speed = (bytesTransferred / timeElapsed) / 1024; // speed in KBps
              lastTime = currentTime;
              lastLoaded = event.loaded;
              onProgress(percentComplete, speed);
            } else {
              console.warn('Progress not computable');
            }
          };
        xhr.upload.addEventListener("progress",progressTracker,false)
        xhr.onload = function() {
          if (xhr.status === 200) {
            return 'File uploaded successfully!';
          } else {
            throw new Error('Upload failed.')
          }
        };
        xhr.send(formData);

      }catch (error) {
        console.error('Error:', error);
        throw new Error('An error occurred while uploading the file.')
      }
    }
  }
};