// Import Vite's helper function for creating a configuration object.
import { defineConfig } from "vite";

// Import the official React plugin so Vite knows how to build
// and serve React applications (including JSX support).
import react from "@vitejs/plugin-react";

// Export the Vite configuration object.
// defineConfig() provides autocomplete, validation,
// and clearer configuration for Vite.
export default defineConfig({
  // Configure Vite's development server.
  server: {
    // Create proxy rules.
    // A proxy forwards requests from one server to another.
    proxy: {
      // Any request beginning with "/api"
      // will follow the rules below.
      "/api": {
        // Forward the request to our backend Express server.
        // In development, Express is running on port 3000.
        target: "http://localhost:3000",

        // Changes the request's origin header
        // so the backend thinks the request came directly to it.
        changeOrigin: true,

        // Skip SSL certificate verification.
        // Mostly useful when using HTTPS with self-signed certificates.
        // Since we're using localhost over HTTP, this doesn't really matter.
        secure: false,

        // Remove "/api" before forwarding the request.
        //
        // React sends:
        //   /api/get-all-animals
        //
        // Express receives:
        //   /get-all-animals
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  // Enable React support for this Vite project.
  plugins: [react()],
});
