import { Suspense, Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SmartCityScene from './SmartCityScene';
import { institucionalInfo } from '@/utils/config';

/**
 * Error Boundary simple para manejar errores de WebGL
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
    console.warn('Error rendering 3D scene:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Componente Hero con animación 3D
 * Incluye escena Three.js en el fondo
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

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Contenido principal */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl"
        >
          {/* Título principal */}
          <h1 className="pixel-title mb-6">
            <span>SEMILLERO IOT E ITSS</span>
          </h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-gray-300 text-lg md:text-xl mb-8"
          >
            Smart Cities • IoT • Gemelos Digitales • ITSS • Laboratorio Remoto
          </motion.p>

          {/* Mascota (Abeja) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-8 flex justify-center"
          >
            <div className="w-48 h-48 relative animate-float">
              {/* Aquí iría la imagen de la abeja/mascota */}
              <div className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center text-6xl shadow-2xl">
                🐝
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-black/30 rounded-full blur-md" />
            </div>
          </motion.div>

          {/* Botones de navegación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/ieee-unipiloto" className="btn-cyber btn-ieee">
              <i className="ti ti-bolt"></i>
              IEEE
            </Link>
            <a href="#laboratorio" className="btn-cyber btn-lab">
              <i className="ti ti-flask"></i>
              Laboratorio
            </a>
            <a href="#blog" className="btn-cyber btn-blog">
              <i className="ti ti-pencil"></i>
              Blog
            </a>
            <a href="#contacto" className="btn-cyber btn-contact">
              <i className="ti ti-mail"></i>
              Contacto
            </a>
          </motion.div>
        </motion.div>

        {/* Indicador de scroll */}
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
