
// Define the structure of a Category
export interface Category {
    id: number;
    name: string;
  }
  
// Define the structure of a Performer
export interface Performer {
  id: number;
  name: string;
}

export interface NetworkReturn{
  message:string
}

export interface ServerStats{
  files: number,
  freeInternal: number,
  totalInternal: number,
  freeExternal: number,
  totalExternal: number,
  hasExternalStorage: Boolean
}

export enum MessageType {
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
}

export interface ToastData {
  id: number;
  message: string;
  type: MessageType; 
}