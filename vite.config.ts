import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// PWA((Progressive Web App) :웹사이트를 앱처럼 동작하게 만드는 기술
// → 홈화면에 설치, 오프라인 지원 등
// PWABuilder가 PWA를 apk로 감싸주는 역할
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "키즈스톡",
        short_name: "키즈스톡",
        description: "어린이를 위한 주식 경제 교육 앱",
        theme_color: "#63b3ed",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        lang: "ko",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://kids-stock-app.vercel.app", // 배포 URL
        changeOrigin: true,
      },
    },
  },
});
