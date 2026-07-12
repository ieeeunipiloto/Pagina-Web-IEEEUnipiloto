/**
 * main.tsx — Punto de entrada principal de la aplicación React.
 *
 * Este archivo es el bootstrap del frontend. Su función es:
 * 1. Crear el QueryClient de TanStack React Query con configuración global.
 * 2. Renderizar el árbol de componentes dentro de React.StrictMode.
 * 3. Proveer el contexto de React Query a toda la aplicación.
 *
 * Responsabilidades:
 * - Configurar reintentos (retry) con backoff exponencial para peticiones fallidas.
 * - Definir tiempos de stale (5 min) y cache (10 min) para datos del servidor.
 * - Deshabilitar refetch al enfocar ventana para evitar peticiones innecesarias.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './styles/index.css';

/**
 * Instancia global de QueryClient con configuración por defecto.
 *
 * - retry: 3 reintentos antes de considerar una query como fallida.
 * - retryDelay: backoff exponencial (1s, 2s, 4s, 8s...) hasta 30s máx.
 * - staleTime: 5 minutos — los datos se consideran frescos durante este tiempo.
 * - cacheTime: 10 minutos — tiempo que los datos permanecen en caché tras ser desactivados.
 * - refetchOnWindowFocus: false — evita refetch al cambiar de pestaña.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Montaje de la aplicación en el DOM.
 * Renderiza el componente App envuelto en StrictMode (detecta efectos secundarios)
 * y QueryClientProvider (provee capacidades de cache/sincronización).
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
