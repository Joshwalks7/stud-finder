import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // amazon-cognito-identity-js expects the Node-style global name in its
  // browser bundle. Vite replaces it with the browser's globalThis object.
  define: {
    global: "globalThis",
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
