export function ServerUrlProvider():string{
    const IS_DEPLOYMENT_STATIC = process.env.NEXT_PUBLIC_IS_DEPLOYMENT_STATIC === "true";
    const API_BASE_URL = IS_DEPLOYMENT_STATIC ?  window.location.origin : process.env.NEXT_PUBLIC_SERVER_ADDRESS ??  window.location.origin;
    return API_BASE_URL
   
}