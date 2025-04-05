import { ServerUrlProvider } from './UrlProvider';
import { FileDataList } from "../types/FileDataList";
import { ServerStats,Item } from '../types/Types'

const API_BASE_URL = ServerUrlProvider();

export const UserRequests = {
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
      async verifyToken(token:string):Promise<{username:string|null,token:string|null,isTokenValid:boolean}> {
        let invalid={username:null,token:null,isTokenValid:false};
        try {
          const response = await fetch(`${API_BASE_URL}/server/verify`, {
            method: 'GET',credentials: 'include', headers: {'Authorization': `Bearer ${token}`},
          })
          if (!response.ok) {
            return invalid
          }
          let data = await response.json();
          if (typeof data === 'object' && data !== null && data.username !== undefined && data.token !== undefined) {
            return {username:data.username,token:data.token,isTokenValid:true}
          }
          return invalid
        } catch (error: any) {
          return invalid
        }
      }
}