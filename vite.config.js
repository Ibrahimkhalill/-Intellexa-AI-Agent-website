import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: true, // ✅ allows access via both localhost & your local network IP
    port: 3901,
  },
  build: {
    rollupOptions: {
      output: {
        // Keep big libraries in their own cacheable chunks
        manualChunks: {
          react: ["react", "react-dom", "react-router", "react-router-dom"],
          firebase: ["firebase/app", "firebase/messaging"],
          markdown: ["react-markdown"],
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    env: {
      VITE_REACT_BASE_URL: "http://api.test",
      VITE_GOOGLE_CLIENT_ID: "test-client-id",
    },
  },
});
