const IS_DEPLOYMENT_STATIC = process.env.NEXT_PUBLIC_IS_DEPLOYMENT_STATIC === "true";
const API_BASE_URL = IS_DEPLOYMENT_STATIC ? "" : process.env.NEXT_PUBLIC_SERVER_ADDRESS ?? "";


import { FileDataList } from "../types/FileDataList";
import { ServerStats } from './../types/Types'
export const ServerRequest = {
  
  async fetchFiles(page?:number): Promise<FileDataList> {
    
    let url=`${API_BASE_URL}/server/files`
    if(page!=undefined){
      url=`${API_BASE_URL}/server/files?page=${page}`
    }
    const response = await fetch(url,{method:"GET",redirect:"follow"});
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`No files found on page ${page}`);
      }
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Failed to fetch files");
    }
    return await response.json();
    
  },

  async uploadThumbnail(fileId: string, imageData: string):Promise<void> {

    let requestBody = JSON.stringify({ fileId, imageData });
    const response = await fetch(`${API_BASE_URL}/server/thumbnail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Thumbnail upload failed");
    }
    return await response.json();
  },

  async fetchThumbnail(fileId: string): Promise<{ imageData: string, exists: boolean }> {
    const response = await fetch(`${API_BASE_URL}/server/thumbnail?fileId=${fileId}`);
    if (!response.ok) {
      return { imageData: "", exists: false }
    }
    return await response.json();
  },
  async uploadFile(file: File|undefined, onProgress: (progress: number, speed: number) => void, passXMLObj:(xhr:XMLHttpRequest)=>void): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      } 
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      
      const xhr = new XMLHttpRequest();
      passXMLObj(xhr)
      xhr.responseType = 'json'
      xhr.open('POST', `${API_BASE_URL}/server/file`, true);

      let lastTime = Date.now();
      let lastLoaded = 0;
      
      xhr.upload.addEventListener("progress",function(event: ProgressEvent<EventTarget>) {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          // Calculate speed
          const currentTime = Date.now();
          const timeElapsed = (currentTime - lastTime) / 1000;
          const bytesTransferred = event.loaded - lastLoaded; 
          const speed = (bytesTransferred / timeElapsed)
          lastTime = currentTime;
          lastLoaded = event.loaded;
          onProgress(percentComplete, speed);
        } else {
          console.warn('Progress not computable');
        }
      },false)
      xhr.onerror = function() {
        reject(new Error('Failed to upload file'));
      };
      xhr.onload = function() {
        if (xhr.status === 200) {
          resolve('File uploaded successfully!');
        } else {
          const response = xhr.response;
          console.error(`Upload failed with error code ${xhr.status} and message ${response?.message || 'Unknown error'}`);
          reject(new Error(`Upload failed with error code ${xhr.status}'}`));
        }
      };
      xhr.send(formData);
    });  
    
  },
  async fetchStats (signal: AbortSignal): Promise<ServerStats>{
      const response = await fetch(`${API_BASE_URL}/server/stats`,{signal});

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
      };
      return responseContent
  },
  async fetchName(fileId: string,signal: AbortSignal): Promise<string>{
   
    const response = await fetch(`${API_BASE_URL}/server/name?fileId=${fileId}`,{signal});

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Failed to fetch file stats");
      }
      const data = await response.json();
      
      // removing file extension
      let name=data.fileName.replace(/\.[a-zA-Z0-9]+$/, "")
      return name

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
        if(error instanceof Error){
          if(error.message==="Failed to fetch"){
            reject(new Error("Server is unreachable."));
            
          }else{
            reject(error);
          }
        }
      }
    });
  },

  async deleteVideo(fileId: string): Promise<void>{
   
    const response = await fetch(`${API_BASE_URL}/server/file?fileId=${fileId}`,{method:"DELETE"});

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Failed to delete the file");
      }
      

  },

  async  testUploadFile(
    file: File | undefined, 
    onProgress: (progress: number, speed: number) => void
  ): Promise<any> {
    if (file) {
        const sizeInBytes = file.size;
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
        console.log(`File size: ${sizeInMB} MB`);
    
        // Simulate the file upload with an interval that mimics progress
        const totalSize = sizeInBytes;
        let uploaded = 0;
        const chunkSize = Math.min(2*1024 * 1024, totalSize / 10); // Simulate chunks of 1MB or 10% of total size
        const totalChunks = Math.ceil(totalSize / chunkSize);
        
        let lastTime = Date.now();
        let lastLoaded = 0;
    
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (uploaded < totalSize) {
            // Simulate uploading a chunk
            uploaded += chunkSize;
            if (uploaded > totalSize) {
              uploaded = totalSize;
            }
            
            const percentComplete = (uploaded / totalSize) * 100;
            const currentTime = Date.now();
            const timeElapsed = (currentTime - lastTime) / 1000;
            const bytesTransferred = uploaded - lastLoaded;
            const speed = timeElapsed > 0 ? (bytesTransferred / timeElapsed): 0;
            lastTime = currentTime;
            lastLoaded = uploaded;
  
            
            onProgress(percentComplete, speed);
          }
  
          if (uploaded >= totalSize) {
            clearInterval(interval);
            resolve('File uploaded successfully!');
          }
        }, 500); // Simulate progress update every 500ms
      });
    } else {
      console.error('No file provided.');
      return Promise.reject('No file provided.');
    }
  }
  
};