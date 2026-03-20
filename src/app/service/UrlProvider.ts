export function ServerUrlProvider(): string {
    const serverAddress = process.env.SERVER_ADDRESS;
    if (typeof window === "undefined") {
        return serverAddress ?? "http://localhost:1280";
    }
    return window.location.origin;
}
