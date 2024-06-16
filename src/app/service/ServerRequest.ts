const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_ADDRESS;

export const ServerRequest = {
    async fetchFiles(): Promise<{ fileId: number; fileName: string }[]> {
        try {
            const response = await fetch(`http://${API_BASE_URL}/files`);
            if (!response.ok) {
                throw new Error('Failed to fetch files');
            }
            return await response.json();
        } catch (error) {
            throw new Error('Failed to fetch files');
        }
    },

    async sendScreenshot(fileId:string,imageData:string){
        try {
            const response = await fetch(`http://${API_BASE_URL}/upload-screenshot`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageData }),
            });
            if (!response.ok) {
                throw new Error('Failed to send screenshot');
            }
            return await response.json();
        } catch (error) {
            throw new Error('Failed to send screenshot');
        }
    }
};
