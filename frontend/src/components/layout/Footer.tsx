/**
 * Footer.tsx — Pie de página principal.
 *
 * Componente de pie de página que muestra:
 * - Año actual dinámico y nombre del semillero.
 * - Nombre de la universidad.
 * - Enlaces sociales: IEEE, GitHub, Email.
 *
 * Todos los enlaces externos se abren en nueva pestaña por seguridad
 * y usan rel="noopener noreferrer" para prevenir tabnabbing.
 */

/**
 * Footer — Componente de pie de página.
 * El año del copyright se calcula automáticamente con new Date().
 *
 * @returns {JSX.Element} Pie de página con créditos y redes sociales
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-8 border-t-4 border-danger-500 mt-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">
            © {currentYear} Semillero IOT E ITSS para Todos
          </p>
          <p className="text-gray-400 mb-1">
            Universidad Piloto de Colombia
          </p>
          <p className="text-sm text-gray-500">
            Diseñado para Investigación y Desarrollo
          </p>
          
          {/* Enlaces a redes y contacto */}
          <div className="mt-6 flex justify-center gap-6">
            <a 
              href="https://www.ieee.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyber-blue hover:text-cyber-red transition-colors"
              aria-label="Sitio web oficial de IEEE"
            >
              <i className="ti ti-bolt text-2xl"></i>
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Repositorio GitHub del semillero"
            >
              <i className="ti ti-brand-github text-2xl"></i>
            </a>
            <a 
              href="mailto:ramaieee@unipiloto.edu.co"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Enviar correo electrónico al semillero"
            >
              <i className="ti ti-mail text-2xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
