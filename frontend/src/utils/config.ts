/**
 * Configuración de la aplicación
 */

export const config = {
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  appName: import.meta.env.VITE_APP_NAME || 'Semillero IOT E ITSS',
  enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
} as const;

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
 * Información institucional
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
