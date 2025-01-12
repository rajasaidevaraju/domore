const IS_DEPLOYMENT_STATIC = process.env.NEXT_PUBLIC_IS_DEPLOYMENT_STATIC === "true";
const API_BASE_URL = IS_DEPLOYMENT_STATIC ? "" : process.env.NEXT_PUBLIC_SERVER_ADDRESS ?? "";


import { FileDataList } from "../types/FileDataList";
import {ServerStats} from './../types/Types'
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
  async uploadFile(file: File|undefined, onProgress: (progress: number, speed: number) => void, passXMLObj:(xhr:XMLHttpRequest)=>void): Promise<any> {

    if (file) {
      const sizeInBytes = file.size; 
      const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
      console.log(`File size: ${sizeInMB} MB`);
      const formData = new FormData();
      formData.append('file', file);
   
      try {
          const xhr = new XMLHttpRequest();
          passXMLObj(xhr)
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
              const speed = (bytesTransferred / timeElapsed)
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
  },
  async fetchStats (signal: AbortSignal): Promise<ServerStats>{
    try {
      const response = await fetch(`${API_BASE_URL}/server/stats`,{signal});

      if (!response.ok) {
        throw new Error(`Failed to fetch storage stats. Status: ${response.status}`);
      }
      const data = await response.json();

      const responseContent = {
        files: data.files,
        freeInternal: data.freeInternal,  
        totalInternal: data.totalInternal,
        freeExternal: data.freeExternal,
        totalExternal: data.totalExternal,
        hasExternalStorage: data.hasExternalStorage,
      };



      return responseContent

    }catch (error) {
      if((error as Error).name === 'AbortError') {
        let abortError=new Error('Fetch request aborted')
        abortError.name="AbortError"
        throw abortError
      } else {
        throw new Error('An error occurred while fetching storage stats.')
      }
    }
  },
  async getActiveServersList(signal: AbortSignal):Promise<string[]>{
    let result:string[]=[]
    try {

      const response = await fetch(`${API_BASE_URL}/server/servers`,{signal});
      if (!response.ok) {
        throw new Error(`Failed to fetch server list. Status: ${response.status}`);
      }
      let data = await response.json();
      if(typeof data === 'object' && data!==null && data.activeServers!==undefined && Array.isArray(data.activeServers)){
        return data.activeServers
      }

      return result

    }catch(error){
      if((error as Error).name === 'AbortError') {
       return result
      }
      throw new Error(`An error occurred while fetching server list`);

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