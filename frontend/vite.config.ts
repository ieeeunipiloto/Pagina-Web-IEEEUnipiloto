/**
 * vite.config.ts — Configuración de Vite para el frontend React.
 *
 * Define plugins (React, disableHostCheck), aliases de importación,
 * servidor de desarrollo con proxy a backend (API y uploads),
 * y optimización de build con code splitting (react-vendor, three-vendor).
 *
 * Ver nota: el host HMR está configurado para un túnel ngrok específico
 * (ipad-decent-unengaged.ngrok-free.dev). Actualizar si se cambia de túnel.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { disableHostCheck } from './vite-plugin-disable-host-check';

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
        manualChunks(id: string) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
            return 'three-vendor';
          }
        },
      },
    },
  },
});
