import { ServerUrlProvider } from './UrlProvider';
import { FileDataList } from "../types/FileDataList";
import { ServerStats,Item, ApiResponse } from './../types/Types'

const API_BASE_URL = ServerUrlProvider();

export const ServerRequest = {
  
  async fetchFiles(page?:number,performerId?:number): Promise<FileDataList> {
    
    let baseURL=API_BASE_URL || window.location.origin

    let url = new URL("/server/files",baseURL);
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

  async updateFileName(fileId: string,newName:string,token:string):Promise<ApiResponse>{
    const response = await fetch(`${API_BASE_URL}/server/file/${fileId}/rename`, {
      method: "PUT",
      headers: { "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify({newName}),
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
