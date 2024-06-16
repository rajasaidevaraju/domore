const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_ADDRESS;

export const ServerRequest = {
    async fetchFiles(): Promise<{ fileId: number; fileName: string }[]> {
        try {
            const response = await fetch(`/server/files`);
            if (!response.ok) {
                throw new Error('Failed to fetch files');
            }
            return await response.json();
        } catch (error) {
            throw new Error('Failed to fetch files');
        }
    },

    async sendScreenshot(fileId:string,imageData:string){
       /* const requestBody={fileId,imageData};*/
        let requestBody=JSON.stringify({fileId,imageData})
        
        const response = await fetch(`/server/upload-screenshot`,{
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
    async requestThumbnail(fileId: string): Promise<{imageData: string,exists:boolean }> {
        
        const response = await fetch(`/server/thumbnail?fileId=${fileId}`);
        if (!response.ok) {
            throw new Error(`status ${response.status} from server`);
        }

        return await response.json();
    }
};
