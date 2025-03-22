
# Next.js Project DoMore

This repository contains a Next.js application that serves as the frontend for the [ServerApp](https://github.com/rajasaidevaraju/ServerApp) backend. Make sure the backend is running before using this frontend application.  Below are the instructions to set up, build, deploy, and run the development environment.

## Prerequisites

Make sure you have the following installed on your system:
- **Node.js**
- **npm**

## Environment Variables

Before running the application, make sure to configure the necessary environment variables in a .env file:

- **`NEXT_PUBLIC_SERVER_ADDRESS`**  
  This variable defines the **backend server's IP address and port** where the frontend will send API requests.  
  - Replace `<your-server-ip>:<port>` with the actual **IP address and port** of your backend server.  
  - Example: If your backend is running on a machine with the IP `10.0.0.181` and port `1280`, set it as:  
    ```
    NEXT_PUBLIC_SERVER_ADDRESS=http://10.0.0.181:1280
    ```
  - This ensures that all API requests from the frontend are correctly routed to the backend server.  

- **`NEXT_PUBLIC_IS_DEPLOYMENT_STATIC`**  
  This flag determines whether the frontend is deployed as a **static site** or a **server-dependent app**.  
  - **Set to `false`** if the application depends on a backend server for API requests.  
  - **Set to `true`** if `output: 'export'` is configured in `next.config.js`, meaning the app is built as a fully **static site**


## Development

To start the development server:

```bash
npm run dev
```

This will start the development server at [http://localhost:3000](http://localhost:3000). Changes to the code will automatically reload the page.

## Build

To create an optimized production build:

```bash
npm run build
```

This will generate the production build in the `build` directory.

## Start (Production)

To start the application in production mode:

1. First, ensure you have built the application (see the **Build** section).
2. Start the server:

   ```bash
   npm run start
   ```

By default, the application will be available at [http://localhost:3000](http://localhost:3000).


## Useful Commands

| Command            | Description                                      |
|--------------------|--------------------------------------------------|
| `npm run dev`      | Start the development server                     |
| `npm run build`    | Create an optimized production build             |
| `npm run start`    | Start the production server                      |
| `npm run lint`     | Run the linter to check for code style issues    |

---
