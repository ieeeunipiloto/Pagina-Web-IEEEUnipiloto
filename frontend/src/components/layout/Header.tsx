import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '@/assets/logo_semillero.png';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-black/95 backdrop-blur-md shadow-lg'
          : 'bg-black'
        } border-b-4 border-danger-500`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y nombre */}
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
            <img src={logo} alt="Logo del Semillero" className="h-10 w-auto" />
          </Link>

          <span className="font-bold text-lg hidden md:block">
            SEMILLERO IOT E ITSS
          </span>

          {/* Menú desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="nav-link text-white hover:text-danger-500 transition-colors">
              Inicio
            </Link>
            <a href="/#institucional" className="nav-link text-white hover:text-danger-500 transition-colors">
              Institucional
            </a>
            <a href="/#laboratorio" className="nav-link text-white hover:text-danger-500 transition-colors">
              Laboratorio
            </a>
            <a href="/#blog" className="nav-link text-white hover:text-danger-500 transition-colors">
              Blog
            </a>
            <a href="/#contacto" className="nav-link text-info-400 font-semibold hover:text-info-300 transition-colors">
              Contacto
            </a>
          </div>

          {/* Botón móvil */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`ti ti-${isMobileMenuOpen ? 'x' : 'menu-2'} text-2xl`}></i>
          </button>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-white hover:text-danger-500 transition-colors"
                onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                Inicio
              </Link>
              <a
                href="/#institucional"
                className="text-white hover:text-danger-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Institucional
              </a>
              <a
                href="/#laboratorio"
                className="text-white hover:text-danger-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Laboratorio
              </a>
              <a
                href="/#blog"
                className="text-white hover:text-danger-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </a>
              <a
                href="/#contacto"
                className="text-info-400 font-semibold hover:text-info-300 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contacto
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
