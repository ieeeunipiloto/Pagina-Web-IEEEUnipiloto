/**
 * Layout.tsx — Componente contenedor principal de la aplicación.
 *
 * Provee la estructura base de todas las páginas:
 * - Header (barra de navegación superior).
 * - <main> (contenido dinámico inyectado por React Router).
 * - Footer (pie de página con créditos).
 *
 * Usa flexbox para asegurar que el footer siempre esté al fondo
 * incluso en páginas con poco contenido (min-h-screen + flex-grow).
 */

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  /** Contenido de la página renderizado por React Router */
  children: ReactNode;
}

/**
 * Layout — Envuelve el contenido de la página con Header y Footer.
 *
 * @param {LayoutProps} props - children es el contenido de la ruta activa
 * @returns {JSX.Element} Estructura completa de página
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
