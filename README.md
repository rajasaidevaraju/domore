# Next.js Frontend: DoMore

This repository contains the Next.js frontend application for the **ServerApp** Android backend project ([https://github.com/rajasaidevaraju/ServerApp](https://github.com/rajasaidevaraju/ServerApp)).

**Important:** This frontend requires the **ServerApp** Android application to be installed, configured (folders selected), and running on your network. This frontend runs as a standard Next.js application (development or production server) and communicates with the backend API to function.

## Overview

DoMore provides a web-based interface to interact with the media files and features managed by the ServerApp backend. Key features include:

* Browse and viewing media files served by the backend.
* Streaming video content directly from the backend.
* Viewing and managing performers associated with files.
* Uploading new media files to the backend server.
* Initiating server operations like scanning folders and repairing paths.
* Viewing server statistics (storage, battery).
* User authentication (Login/Logout).

## Prerequisites

Make sure you have the following installed on your system:
* **Node.js** (Check Next.js documentation for compatible versions)
* **npm** (or yarn/pnpm)

## Backend Dependency

This frontend **cannot function** without the **ServerApp** Android backend. Ensure the ServerApp is:
1.  Installed on an Android device on the same network.
2.  Configured with the necessary storage folders selected within the Android app.
3.  Actively running (the "Backend Server" started from within the Android app).

## Environment Variables

Create a `.env.local` file in the root of the project to configure the backend API address.

Required environment variables:

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_SERVER_ADDRESS` | Specifies the full URL (including protocol, IP address, and port) where the **ServerApp** backend API is accessible. This is primarily used during server-side rendering. | `http://192.168.2.90:1280` |
| `NEXT_PUBLIC_SERVER_FROM_ENV` | When set to `true`, the frontend will use `NEXT_PUBLIC_SERVER_ADDRESS` for server-side operations (SSR). For client-side requests, it enables the `/server` rewrite rule to proxy requests to `SERVER_ADDRESS`. If `false`, the client-side will default to `http://<hostname>:3000` for API calls. | `true` |
| `SERVER_ADDRESS` | This variable is used by Next.js's `rewrites` configuration to proxy client-side requests made to `/server/:path*` to the actual backend server. **Crucially, this variable is used directly by the Next.js server, not exposed to the browser via `NEXT_PUBLIC_`.** | `http://192.168.2.90:1280` |


### How it works

- If `NEXT_PUBLIC_SERVER_FROM_ENV` is set to `true`, the frontend **always** uses `NEXT_PUBLIC_SERVER_ADDRESS` as the backend URL.
- If `NEXT_PUBLIC_SERVER_FROM_ENV` is set to `false`, the frontend will attempt to **build the backend URL dynamically** using the current browser location (e.g., `http://<hostname>:1280`).
- **Recommended:** Set `NEXT_PUBLIC_SERVER_FROM_ENV=true` and specify the exact `NEXT_PUBLIC_SERVER_ADDRESS` for reliable communication.

### Example `.env.local`:

```env
NEXT_PUBLIC_SERVER_ADDRESS=http://192.168.2.90:1280
NEXT_PUBLIC_SERVER_FROM_ENV=true
SERVER_ADDRESS=http://192.168.2.90:1280
```

## Technology Stack

* Next.js (React Framework)
* React
* TypeScript
* Tailwind CSS
* Zustand (State Management)
* html2canvas (for thumbnails)

## Available Scripts

| Command         | Description                                           |
| --------------- | ----------------------------------------------------- |
| `npm run dev`   | Start the development server                          |
| `npm run build` | Create an optimized build for the production server   |
| `npm run start` | Start the production server (requires a prior build)  |
| `npm run lint`  | Run ESLint to check for code style issues             |

---