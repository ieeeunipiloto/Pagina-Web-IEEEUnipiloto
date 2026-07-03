/**
 * IEEEInfo.tsx — Página informativa del Capítulo Estudiantil IEEE Unipiloto.
 *
 * Esta página describe:
 * - Qué es el capítulo estudiantil IEEE de la Universidad Piloto de Colombia.
 * - Las sociedades técnicas activas (ITSS, IoT, RAS).
 * - Actividades y beneficios para miembros.
 * - Llamados a la acción para unirse o visitar IEEE.org.
 *
 * Es una página estática (sin fetching de datos) con información institucional.
 */

/**
 * IEEEInfo — Página de información del capítulo IEEE.
 *
 * @returns {JSX.Element} Página informativa con diseño de tarjeta blanca sobre fondo azul
 */
export default function IEEEInfo() {
  return (
    <div className="min-h-screen bg-[#030d38] py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
          IEEE - Universidad Piloto de Colombia
        </h1>
        
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-2xl">
          {/* Descripción del capítulo estudiantil */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary-600 mb-4">
              Capítulo Estudiantil IEEE
            </h2>
            <p className="text-gray-700 mb-4">
              El capítulo estudiantil IEEE de la Universidad Piloto de Colombia es una comunidad 
              activa de estudiantes apasionados por la tecnología, la innovación y la investigación.
            </p>
            <p className="text-gray-700">
              Formamos parte de la red global del Institute of Electrical and Electronics Engineers (IEEE), 
              la organización profesional técnica más grande del mundo dedicada al avance de la tecnología 
              en beneficio de la humanidad.
            </p>
          </div>

          {/* Sociedades técnicas activas en el capítulo */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-danger-600 mb-3">
              Sociedades Técnicas
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="ti ti-chevron-right text-cyber-blue mr-2 mt-1"></i>
                <span className="text-gray-700">
                  <strong>IEEE ITSS (Intelligent Transportation Systems Society):</strong> 
                  Enfocada en sistemas de transporte inteligentes y movilidad sostenible
                </span>
              </li>
              <li className="flex items-start">
                <i className="ti ti-chevron-right text-cyber-blue mr-2 mt-1"></i>
                <span className="text-gray-700">
                  <strong>IEEE IoT:</strong> Internet de las Cosas y dispositivos conectados
                </span>
              </li>
              <li className="flex items-start">
                <i className="ti ti-chevron-right text-cyber-blue mr-2 mt-1"></i>
                <span className="text-gray-700">
                  <strong>IEEE RAS (Robotics and Automation):</strong> Robótica y automatización
                </span>
              </li>
            </ul>
          </div>

          {/* Beneficios de pertenecer al capítulo */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-primary-600 mb-3">
              Actividades y Beneficios
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <i className="ti ti-presentation text-3xl text-cyber-blue mb-2"></i>
                <h4 className="font-bold mb-1 text-gray-900">Talleres y Charlas</h4>
                <p className="text-sm text-gray-600">
                  Eventos técnicos con expertos de la industria
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <i className="ti ti-trophy text-3xl text-cyber-orange mb-2"></i>
                <h4 className="font-bold mb-1 text-gray-900">Competencias</h4>
                <p className="text-sm text-gray-600">
                  Participación en desafíos nacionales e internacionales
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <i className="ti ti-users text-3xl text-cyber-green mb-2"></i>
                <h4 className="font-bold mb-1 text-gray-900">Networking</h4>
                <p className="text-sm text-gray-600">
                  Conexión con profesionales y estudiantes de todo el mundo
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <i className="ti ti-book text-3xl text-cyber-red mb-2"></i>
                <h4 className="font-bold mb-1 text-gray-900">Recursos IEEE</h4>
                <p className="text-sm text-gray-600">
                  Acceso a publicaciones y biblioteca digital
                </p>
              </div>
            </div>
          </div>

          {/* Llamado a la acción */}
          <div className="text-center mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              ¿Quieres ser parte del capítulo IEEE?
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a 
                href="https://www.ieee.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-cyber btn-ieee px-8"
              >
                <i className="ti ti-external-link"></i>
                Visitar IEEE.org
              </a>
              <a 
                href="/#contacto"
                className="btn-cyber btn-contact px-8"
              >
                <i className="ti ti-mail"></i>
                Contáctanos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
