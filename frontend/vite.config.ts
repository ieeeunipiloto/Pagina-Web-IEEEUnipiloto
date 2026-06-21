import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { disableHostCheck } from './vite-plugin-disable-host-check';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), disableHostCheck()],
  define: {
    // Desactivar verificación de host en desarrollo
    'process.env.DANGEROUSLY_DISABLE_HOST_CHECK': JSON.stringify('true'),
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    cors: true,
    // Desactivar verificación de host
    hmr: {
      clientPort: 443,
      protocol: 'wss',
      host: 'ipad-decent-unengaged.ngrok-free.dev', // Host específico de ngrok
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  preview: {
    host: true,
    port: 5173,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
