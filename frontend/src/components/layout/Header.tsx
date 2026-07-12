import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import beeImg from '@/assets/Abeja_Camiseta.png';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGruposOpen, setIsGruposOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsGruposOpen(false);
  };

  const baseClass =
    'inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-medium border-2 border-transparent hover:-translate-y-0.5 transition-all duration-200 text-gray-300 hover:text-white';

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#000000]/95 backdrop-blur-md shadow-lg'
          : 'bg-[#000000]'
      } border-b-2 border-[#ff3b3b]`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Left: Eventos, Semillero, Laboratorio (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/#blog"
              className={`${baseClass} hover:border-[#00d4ff]/40 hover:shadow-[0_0_15px_rgba(0,212,255,0.3)]`}
            >
              <i className="ti ti-calendar-event text-cyber-blue"></i>
              Eventos
            </a>
            <a href="/#institucional" className={`${baseClass} hover:border-[#f3961e]/40 hover:shadow-[0_0_15px_rgba(243,150,30,0.3)]`}>
              <i className="ti ti-users text-cyber-orange"></i>
              Semillero
            </a>
            <a href="/#laboratorio" className={`${baseClass} hover:border-[#059669]/40 hover:shadow-[0_0_15px_rgba(5,150,105,0.3)]`}>
              <i className="ti ti-flask text-cyber-green"></i>
              Laboratorio
            </a>
          </div>

          {/* Center: Bee logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="absolute left-1/2 -translate-x-1/2 top-full -translate-y-1/2 z-10"
          >
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center p-2 shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] transition-shadow duration-300 animate-float">
              <img
                src={beeImg}
                alt="Abeja Mascota del Semillero"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* Right: Grupos, IEEE, Contacto, Theme toggle (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsGruposOpen(!isGruposOpen)}
                className={`${baseClass} hover:border-[#db2777]/40 hover:shadow-[0_0_15px_rgba(219,39,119,0.3)]`}
              >
                <i className="ti ti-affiliate text-cyber-purple"></i>
                Grupos
                <i
                  className={`ti ti-chevron-down text-xs transition-transform duration-200 ${isGruposOpen ? 'rotate-180' : ''}`}
                ></i>
              </button>
              {isGruposOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-dark-800/95 border border-dark-600 rounded-xl shadow-2xl py-2 backdrop-blur-md">
                  <Link
                    to="/ieee-unipiloto"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => setIsGruposOpen(false)}
                  >
                    <i className="ti ti-bolt text-cyber-blue"></i>
                    IEEE ITSS
                  </Link>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => setIsGruposOpen(false)}
                  >
                    <i className="ti ti-wifi text-cyber-green"></i>
                    IEEE IoT
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => setIsGruposOpen(false)}
                  >
                    <i className="ti ti-robot text-cyber-red"></i>
                    IEEE RAS
                  </a>
                </div>
              )}
            </div>
            <Link to="/ieee-unipiloto" className={`${baseClass} hover:border-[#00d4ff]/40 hover:shadow-[0_0_15px_rgba(0,212,255,0.3)]`}>
              <i className="ti ti-bolt text-cyber-blue"></i>
              IEEE
            </Link>
            <a href="/#contacto" className={`${baseClass} hover:border-[#f05f7c]/40 hover:shadow-[0_0_15px_rgba(240,95,124,0.3)]`}>
              <i className="ti ti-mail text-cyber-pink"></i>
              Contacto
            </a>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-transparent hover:border-[#00d4ff]/40 hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:-translate-y-0.5 transition-all duration-200 text-gray-300 hover:text-white"
              aria-label="Cambiar tema"
            >
              <i className={`ti ti-${isDark ? 'moon' : 'sun'}`}></i>
            </button>
          </div>

          {/* Hamburger menu (mobile) */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menú"
          >
            <i
              className={`ti ti-${isMobileMenuOpen ? 'x' : 'menu-2'} text-2xl`}
            ></i>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-700">
            <div className="flex flex-col gap-1">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                <i className="ti ti-calendar-event text-cyber-blue"></i>
                Eventos
              </Link>
              <a
                href="/#institucional"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                <i className="ti ti-users text-cyber-orange"></i>
                Semillero
              </a>
              <div className="px-4 py-3">
                <button
                  onClick={() => setIsGruposOpen(!isGruposOpen)}
                  className="flex items-center gap-3 w-full text-gray-300 hover:text-white transition-colors"
                >
                  <i className="ti ti-affiliate text-cyber-purple"></i>
                  Grupos
                  <i
                    className={`ti ti-chevron-down ml-auto transition-transform ${isGruposOpen ? 'rotate-180' : ''}`}
                  ></i>
                </button>
                {isGruposOpen && (
                  <div className="ml-8 mt-2 flex flex-col gap-1">
                    <Link
                      to="/ieee-unipiloto"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <i className="ti ti-bolt text-cyber-blue"></i>
                      IEEE ITSS
                    </Link>
                    <a
                      href="#"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <i className="ti ti-wifi text-cyber-green"></i>
                      IEEE IoT
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <i className="ti ti-robot text-cyber-red"></i>
                      IEEE RAS
                    </a>
                  </div>
                )}
              </div>
              <a
                href="/#laboratorio"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                <i className="ti ti-flask text-cyber-green"></i>
                Laboratorio
              </a>
              <Link
                to="/ieee-unipiloto"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                <i className="ti ti-bolt text-cyber-blue"></i>
                IEEE
              </Link>
              <a
                href="/#contacto"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                <i className="ti ti-mail text-cyber-pink"></i>
                Contacto
              </a>
              <button
                onClick={() => { toggleTheme(); closeMobileMenu(); }}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <i className={`ti ti-${isDark ? 'moon' : 'sun'}`}></i>
                Tema
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
