import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

const backendTarget = "http://localhost:8080";

const configureProxyRequest = (proxy: unknown) => {
  const proxyServer = proxy as any;
  proxyServer.on("proxyReq", (proxyReq: any) => {
    // Local dev: prevent backend CORS filter from treating proxied requests as cross-origin.
    proxyReq.removeHeader("origin");
  });
};

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/products": {
        target: backendTarget,
        changeOrigin: true,
        configure: configureProxyRequest,
      },
      "/api/_admin": {
        target: backendTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/_admin/, "/admin"),
        configure: configureProxyRequest,
      },
      "/api": {
        target: backendTarget,
        changeOrigin: true,
        configure: configureProxyRequest,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
