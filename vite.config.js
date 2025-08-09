import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: "127.0.0.1", // force IPv4 localhost, not ::1 IPv6
    port: 3901, // use port 3000 instead of 5173
  },
});
