import {ApiResponse } from '../types/Types'
import {ServerUrlProvider} from '../service/UrlProvider'

const API_BASE_URL = ServerUrlProvider();

export const OperationRequests = {

    async fetchCleanup(token:string):Promise<ApiResponse>{

        const response = await fetch(`${API_BASE_URL}/server/cleanup`, { method: "DELETE",headers: {'Authorization': `Bearer ${token}`}, });
    
        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to perform cleanup");
        }

        let data=await response.json();
        return {message:data.message}
    },
    async fetchScan(token:string):Promise<ApiResponse>{

        const response = await fetch(`${API_BASE_URL}/server/scan`, { method: "POST",headers: {'Authorization': `Bearer ${token}`}, });
        
        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to perform scan");
        }

        let data=await response.json();
        return {message:data.message}
        
    },

    async fetchRepair(token:string):Promise<ApiResponse>{

        const response = await fetch(`${API_BASE_URL}/server/repair`, { method: "PUT",headers: {'Authorization': `Bearer ${token}`}, });
        
        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to perform repair");
        }

        let data=await response.json();
        return {message:data.message}
        
    }

}