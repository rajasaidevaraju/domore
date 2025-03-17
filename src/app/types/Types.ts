
export interface Item {
  id: number;
  name: string;
}

  
// Define the structure of a Performer
export interface Performer extends Item {

}

// Define the structure of a Category
export interface Category extends Item {

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
  hasExternalStorage: boolean,
  percentage: number,
  charging: boolean
}

export interface ToastMessageDetails {
  message: string;
  type: MessageType;
}

export enum MessageType {
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
}

export enum EntityType {
  Category = "category",
  Performer = "performer",
}

export interface ToastData {
  id: number;
  message: string;
  type: MessageType; 
}

export interface CardProps {
  isLoggedIn: boolean;
  showToast:(toastDetails: ToastMessageDetails) => void
}

export interface ApiResponse {
  message: string;
}