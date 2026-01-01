export function ServerUrlProvider(): string {
    const serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
    const serverFromEnvFlag = process.env.NEXT_PUBLIC_SERVER_FROM_ENV === "true";

    if (typeof window === "undefined") {
        // Server-side (during SSR or build)
        return serverFromEnvFlag ? (serverAddress ?? "http://localhost:1280") : "http://localhost:1280";
    }

    // Client-side (browser)
    /*if (serverFromEnvFlag && serverAddress) {
        return serverAddress;
    } else {
        const hostname = window.location.hostname;
        return `http://${hostname}:1280`;
    }*/
    const hostname = window.location.hostname;
    const port = window.location.port;
    return `http://${hostname}:${port}`;
}
