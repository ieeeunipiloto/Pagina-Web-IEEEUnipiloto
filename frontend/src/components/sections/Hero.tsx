/**
 * Hero.tsx — Sección Hero principal con animación 3D y contenido introductorio.
 *
 * Esta es la primera sección que ve el usuario. Combina:
 * 1. Escena 3D interactiva (SmartCityScene) renderizada con Three.js / React Three Fiber.
 * 2. Overlay oscuro para legibilidad del texto.
 * 3. Título pixelado "SEMILLERO IOT E ITSS".
 * 4. Mascota del semillero (abeja) con animación flotante.
 * 5. Botones de navegación rápida a las secciones principales.
 * 6. Indicador de scroll animado.
 *
 * Manejo de errores:
 * - ErrorBoundary captura errores de WebGL y muestra un fallback plano.
 * - Suspense maneja la carga diferida del canvas 3D.
 */

import { Suspense, Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import SmartCityScene from './SmartCityScene';
import Terminal from './Terminal';

/**
 * ErrorBoundary — Captura errores de renderizado en la escena 3D.
 *
 * Si SmartCityScene falla (ej. WebGL no soportado), muestra un fallback
 * visual en lugar de romper toda la página.
 *
 * @extends {Component<{children: ReactNode, fallback: ReactNode}, {hasError: boolean}>}
 */
class ErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('Error al renderizar escena 3D:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Hero — Componente principal del encabezado de la página.
 *
 * Incluye la escena 3D de fondo con SmartCityScene, la mascota flotante,
 * el título principal y botones de navegación con animaciones de entrada.
 *
 * @returns {JSX.Element} Sección hero de pantalla completa
 */
export default function Hero() {
  return (
    <section id="hero3d" className="relative h-screen overflow-hidden bg-[#030d38]">
      {/* Escena 3D en el fondo - con fallback en caso de error WebGL */}
      <Suspense fallback={<div className="absolute inset-0 bg-[#030d38]" />}>
        <ErrorBoundary fallback={<div className="absolute inset-0 bg-[#030d38]" />}>
          <SmartCityScene />
        </ErrorBoundary>
      </Suspense>

      {/* Overlay oscuro para mejorar contraste del texto sobre la escena 3D */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Degradado inferior para transición suave entre hero y contenido */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-[#030d38] z-30" />

      {/* Contenido principal centrado */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl"
        >
          {/* Título principal con estilo pixelado */}
          <h1 className="pixel-title mb-6">
            <span>SEMILLERO IOT E ITSS</span>
          </h1>

          {/* Subtítulo con áreas de enfoque */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-gray-300 text-lg md:text-xl mb-8"
          >
            Smart Cities • IoT • Gemelos Digitales • ITSS • Laboratorio Remoto
          </motion.p>

          {/* Terminal interactiva */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-8"
          >
            <Terminal />
          </motion.div>


        </motion.div>

        {/* Indicador animado de scroll hacia abajo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a href="#institucional" className="text-white">
            <i className="ti ti-chevron-down text-3xl animate-bounce"></i>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
