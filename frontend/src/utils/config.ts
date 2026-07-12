/**
 * utils/config.ts — Configuración global de la aplicación e información institucional.
 *
 * Este módulo centraliza:
 * 1. Variables de entorno accesibles mediante import.meta.env (Vite).
 * 2. Función utilitaria getImageUrl para resolver rutas de imágenes.
 * 3. Información institucional estática del semillero.
 *
 * Las variables de entorno se definen en frontend/.env o en el docker-compose.
 */

/**
 * Objeto de configuración con valores por defecto.
 * - apiUrl: URL base para peticiones API (proxy en desarrollo / Vite).
 * - backendUrl: URL directa del backend (usada para resolver /uploads/).
 * - appName: Nombre de la aplicación desde variable de entorno.
 * - enableDevtools: Habilita herramientas de desarrollo (React Query Devtools, etc.).
 *
 * Todas las propiedades son de solo lectura (as const) para evitar mutaciones.
 */
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  appName: import.meta.env.VITE_APP_NAME || 'Semillero IOT E ITSS',
  enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
} as const;

/**
 * Convierte una ruta de imagen (local o URL) en una URL completamente calificada.
 *
 * Lógica de resolución:
 * 1. Si la ruta es null/undefined, retorna undefined.
 * 2. Si la ruta empieza con /uploads/, antepone config.backendUrl.
 * 3. Si la ruta es una URL absoluta válida, la retorna tal cual.
 * 4. En cualquier otro caso, antepone config.backendUrl.
 *
 * @param path - Ruta de la imagen (ej. "/uploads/abc.jpg" o "https://ejemplo.com/img.png")
 * @returns URL completa o undefined si no hay path
 */
export function getImageUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;

  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (normalized.startsWith('/uploads/')) {
    return `${config.backendUrl}${normalized}`;
  }

  try {
    new URL(normalized);
    return normalized;
  } catch {
    return `${config.backendUrl}${normalized}`;
  }
}

/**
 * Información institucional estática del semillero.
 * Utilizada en la sección "Institucional" de la página principal.
 * - nombre: Nombre completo del semillero
 * - director: Nombre del director de investigación
 * - sesiones: Día y ubicación de las sesiones de trabajo
 * - mision: Declaración de misión del semillero
 * - vision: Declaración de visión a 2027
 */
export const institucionalInfo = {
  nombre: 'Semillero IOT E ITSS para Todos',
  director: 'Luis Felipe Herrera Quintero',
  sesiones: {
    dia: 'Jueves',
    lugar: 'Edificio F - Laboratorios Sótano',
  },
  mision: 'Impulsar el desarrollo de competencias en IoT y sistemas embebidos a través de la experimentación y la investigación aplicada para resolver problemas del entorno real.',
  vision: 'Para el año 2027, consolidarnos como el nodo de innovación líder en la región, integrando tecnologías de IA y energías limpias en proyectos de impacto social.',
} as const;
