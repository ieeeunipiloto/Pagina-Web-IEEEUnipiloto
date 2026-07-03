import type { Plugin } from 'vite';

/**
 * Plugin de Vite para desactivar la verificación de host
 * Útil para desarrollo con ngrok o túneles similares
 */
export function disableHostCheck(): Plugin {
  return {
    name: 'disable-host-check',
    configureServer(server) {
      // Interceptar el middleware de verificación de host
      server.middlewares.use((req, res, next) => {
        // Permitir todos los hosts
        next();
      });
    },
  };
}
