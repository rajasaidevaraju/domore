const IS_DEPLOYMENT_STATIC = process.env.NEXT_PUBLIC_IS_DEPLOYMENT_STATIC === "true";
const API_BASE_URL = IS_DEPLOYMENT_STATIC ? "" : process.env.NEXT_PUBLIC_SERVER_ADDRESS ?? "";


import { FileDataList } from "../types/FileDataList";
import { ServerStats,Item } from './../types/Types'
export const ServerRequest = {
  
  async fetchFiles(page?:number,performerId?:number): Promise<FileDataList> {
    
    let url = new URL(`${API_BASE_URL}/server/files`);
    if (page !== undefined) {
      url.searchParams.append("page", page.toString());
    }
    if (performerId !== undefined) {
      url.searchParams.append("performerId", performerId.toString());
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



  async uploadThumbnail(fileId: string, imageData: string,token:string):Promise<void> {

    let requestBody = JSON.stringify({ fileId, imageData });
    const response = await fetch(`${API_BASE_URL}/server/thumbnail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
      body: requestBody,
    });
    if (!response.ok) {
      let defaultErrorMessage = "Thumbnail upload failed";
      if(response.status===401){
         defaultErrorMessage="Unauthorized"
      }
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || defaultErrorMessage);
    }
    await response.json();

    return;
  },

  async fetchThumbnail(fileId: string): Promise<{ imageData: string, exists: boolean }> {
    const response = await fetch(`${API_BASE_URL}/server/thumbnail?fileId=${fileId}`);
    if (!response.ok) {
      return { imageData: "", exists: false }
    }
    return await response.json();
  },
  async uploadFile(file: File|undefined, token:string, onProgress: (progress: number, speed: number) => void, passXMLObj:(xhr:XMLHttpRequest)=>void): Promise<string> {
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
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      let lastTime = Date.now();
      let lastLoaded = 0;
      let lastUpdate = 0;
      const UPDATE_INTERVAL = 1000;

      xhr.upload.addEventListener("progress",function(event: ProgressEvent<EventTarget>) {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          // Calculate speed
          const currentTime = Date.now();
          const timeElapsed = (currentTime - lastTime) / 1000;
          const bytesTransferred = event.loaded - lastLoaded; 
          const speed = (bytesTransferred / timeElapsed)

          if (currentTime - lastUpdate >= UPDATE_INTERVAL|| percentComplete === 100) {
            onProgress(percentComplete, speed);
            lastUpdate = currentTime;
          }

          lastTime = currentTime;
          lastLoaded = event.loaded;
          
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
      }
      return responseContent
  },
  async fetchName(fileId: string,signal?: AbortSignal): Promise<string>{
   
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

  async fetchfileDetails(fileId: string,signal?: AbortSignal): Promise<{id:number, name:string,performers:Item[]}>{

    const response = await fetch(`${API_BASE_URL}/server/fileDetails/${fileId}`,{signal});

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Failed to fetch file details");
    }
    const data = await response.json();
    // removing file extension
    let name=data.name.replace(/\.[a-zA-Z0-9]+$/, "")
    return {id:data.id, name:name	,performers:data.performers}

  },
  async loginUser(username: string, password: string): Promise<{ token: string|null,error:string|null }> {
    try {
      const response = await fetch(`${API_BASE_URL}/server/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });
  
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        return {token:null,error:error?.message || `Login failed: ${response.statusText}`};
      }
  
      const data = await response.json();
  
      if (typeof data === 'object' && data !== null && typeof data.token === 'string') {
        return { token: data.token ,error:null};
      } else {
        throw new Error("Invalid login response from server. Missing or invalid token.");
      }
    } catch (error: any) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error("Server is unreachable. Please check your network connection.");
      }
      throw error;
    }
  },
  async logoutUser(token: string): Promise<{ message: string|null, error: string|null }> {
    try {
      const response = await fetch(`${API_BASE_URL}/server/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: "include"
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        return { message: null, error: error?.message || `Logout failed: ${response.statusText}` };
      }

      const data = await response.json();

      if (typeof data === 'object' && data !== null && typeof data.message === 'string') {
        return { message: data.message, error: null };
      } else {
        throw new Error("Invalid logout response from server.");
      }
    } catch (error: any) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error("Server is unreachable. Please check your network connection.");
      }
      throw error;
    }
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

  async deleteVideo(fileId: string,token:string): Promise<void>{
   
    const response = await fetch(`${API_BASE_URL}/server/file?fileId=${fileId}`,
      {
        method:"DELETE",
        headers: {'Authorization': `Bearer ${token}`},
        credentials: "include"
      });

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