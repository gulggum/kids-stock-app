import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://kids-stock-app.vercel.app", // 배포 URL
        changeOrigin: true,
      },
    },
  },
});
