const IS_DEPLOYMENT_STATIC = process.env.NEXT_PUBLIC_IS_DEPLOYMENT_STATIC === "true";
const API_BASE_URL = IS_DEPLOYMENT_STATIC ? "" : process.env.NEXT_PUBLIC_SERVER_ADDRESS ?? "";
import { EntityType, Item, ApiResponse } from './../types/Types'

export const FilterRequests = {
    async fetchItems(type: EntityType): Promise<Item[]> {

        //add s to type
        let updatedType=type+"s"

        const response = await fetch(`${API_BASE_URL}/server/${updatedType}`, { method: "GET" });
        
        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to fetch items");
        }
        return await response.json();
    },

    async addItems(type: EntityType,names:string[],token:string): Promise<ApiResponse> {

         //add s to type
        let updatedType=type+"s"

        const response = await fetch(`${API_BASE_URL}/server/${updatedType}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: "include",
            body: JSON.stringify({ names }),
        });
        if (response.status === 401) {
            throw new Error("Unauthorized access");
        }
        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to add item");
        }
        return await response.json();
    },

    async deleteItems(type: EntityType, ids: number[],token:string): Promise<ApiResponse> {

        let endpoint="deleteCategories"
        if(type===EntityType.Performer){
            endpoint="deletePerformers"
        }

        const response = await fetch(`${API_BASE_URL}/server/${endpoint}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: "include",
            body: JSON.stringify({ ids })
        });
    
        if (response.status === 401) {
            throw new Error("Unauthorized access");
        }
        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to delete items");
        }
        return await response.json();
    },

    async updateItem(type: EntityType, id: number, updatedName: string): Promise<ApiResponse> {
        const response = await fetch(`${API_BASE_URL}/server/${type}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedName),
        });
        if (response.status === 401) {
            throw new Error("Unauthorized access");
        }
        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to update item");
        }
        return await response.json();
    },

    async addItemToFile(fileId: number, itemId: number, type: EntityType,token: string): Promise<ApiResponse> {

        const response = await fetch(`${API_BASE_URL}/server/file/${fileId}/${type}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({itemId}),
            credentials: "include",
        });
        if (response.status === 401) {
            throw new Error("Unauthorized access");
        }
        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Failed to add performer to file");
        }
        return await response.json();
    }
}