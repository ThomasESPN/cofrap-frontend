import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://34.79.63.215:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/function'),
        headers: {
          'Accept': 'application/json, image/png, */*',
          'Content-Type': 'application/json',
        },
      },
    },
  },
});
