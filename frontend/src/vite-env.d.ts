/**
 * vite-env.d.ts — Declaraciones de tipos para Vite y módulos de assets.
 *
 * Este archivo cumple dos funciones:
 * 1. Referencia los tipos globales de Vite (import.meta.env, etc.).
 * 2. Declara módulos para archivos de imagen estáticos (PNG, JPG, SVG...)
 *    para que TypeScript no marque error al importarlos en componentes React.
 *
 * Sin estas declaraciones, TypeScript lanzaría errores como:
 * "Cannot find module './logo.png' or its corresponding type declarations."
 */

/// <reference types="vite/client" />

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.avif' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
