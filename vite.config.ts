import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@config": path.resolve(__dirname, "./src/config"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy hacia tu Spring Boot en desarrollo
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        // Si tu Spring Boot no usa prefijo /api, descomenta:
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});