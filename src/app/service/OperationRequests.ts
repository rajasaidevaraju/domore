const IS_DEPLOYMENT_STATIC = process.env.NEXT_PUBLIC_IS_DEPLOYMENT_STATIC === "true";
const API_BASE_URL = IS_DEPLOYMENT_STATIC ? "" : process.env.NEXT_PUBLIC_SERVER_ADDRESS ?? "";
import { EntityType, Item, ApiResponse } from '../types/Types'


export const OperationRequests = {
    async fetchScan(token:string):Promise<ApiResponse>{

        const response = await fetch(`${API_BASE_URL}/server/scan`, { method: "POST",headers: {'Authorization': `Bearer ${token}`}, });
        
        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to fetch items");
        }

        let data=await response.json();
        return {message:data.message}
        
    }
}