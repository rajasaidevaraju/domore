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

Create a `.env.local` file in the root of the project to configure the backend API address:

* **`NEXT_PUBLIC_SERVER_ADDRESS`** (Required)
    * **Purpose:** Specifies the full URL (including protocol, IP address, and port) where the **ServerApp** backend API is accessible. The frontend sends all API requests to this address.
    * **Format:** `http://<your-android-device-ip>:<port>` (Default backend port is `1280`).
    * **Example:** If your ServerApp backend is running on `192.168.1.100` at port `1280`, set:
        ```
        NEXT_PUBLIC_SERVER_ADDRESS=[http://192.168.1.100:1280](http://192.168.1.100:1280)
        ```
    * **Finding the IP:** You can usually find the Android device's IP address in its Wi-Fi settings. The ServerApp Android app also displays the IP and port when the server is running.

## Running the Frontend

### Development Mode

1.  Ensure the **ServerApp** backend is running.
2.  Set the correct `NEXT_PUBLIC_SERVER_ADDRESS` in your `.env.local` file.
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser to `http://localhost:3000` (or the specified port). The application will auto-reload upon code changes.

### Production Mode

1.  Ensure the **ServerApp** backend is running.
2.  Set the correct `NEXT_PUBLIC_SERVER_ADDRESS` in your `.env.local` file (or configure it via your production environment's variable system).
3.  Build the application:
    ```bash
    npm run build
    ```
    This creates an optimized production build in the `.next` directory (or your configured `distDir` if different from the default).
4.  Start the production server:
    ```bash
    npm run start
    ```
5.  Access the application via its URL (e.g., `http://localhost:3000` or your deployment URL).

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