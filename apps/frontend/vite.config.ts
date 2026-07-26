import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Proxy API calls to FastAPI backend during development
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
  define: {
    // Allow VITE_API_URL env variable; fall back to empty string (proxy handles it)
    "import.meta.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL ?? ""),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks for better caching
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('framer-motion')) {
            return 'framer-motion';
          }
          if (id.includes('lucide-react')) {
            return 'lucide-react';
          }
          // Context providers
          if (id.includes('/context/')) {
            return 'context';
          }
        },
      },
    },
    chunkSizeWarningLimit: 300,
  },
});