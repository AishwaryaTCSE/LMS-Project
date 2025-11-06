import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  // Set root to the current directory since index.html is in the root
  root: __dirname,
  base: '/',
  
  plugins: [
    react(),
    tailwindcss(),
  ],
  
  server: {
    port: 3000,  // Changed to 3000 to match common React dev server port
    strictPort: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // Your backend server
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    cors: true,
  },
  
  resolve: {
    alias: {
      // Update aliases to be relative to the frontend/src directory
      '@': path.resolve(__dirname, 'frontend/src'),
      // Add any other aliases you might need
      '~': path.resolve(__dirname, 'frontend/src'),
    },
  },
  
  // Configure build output
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'frontend/index.html'),
      },
    },
  },
  
  // Configure CSS
  css: {
    devSourcemap: true,
  },
});