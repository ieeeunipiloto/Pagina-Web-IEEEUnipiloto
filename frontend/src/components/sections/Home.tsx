import { useQuery } from '@tanstack/react-query';
import Hero from './Hero';
import { api } from '@/services/api';
import { Project, Post } from '@/types';
import { institucionalInfo } from '@/utils/config';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  // Obtener proyectos
  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.getProjects(),
  });

  // Obtener posts
  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () => api.getPosts(),
  });

  return (
    <>
      <Hero />

      {/* Sección Institucional */}
      <section id="institucional" className="container mx-auto px-4 py-16">
        <h2 className="section-title">
          Sobre el {institucionalInfo.nombre}
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Misión */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-dynamic bg-gray-100 p-6 border-t-4 border-primary-500"
          >
            <h4 className="text-primary-600 font-bold text-xl mb-3">
              Nuestra Misión
            </h4>
            <p className="text-gray-700">
              {institucionalInfo.mision}
            </p>
          </motion.div>

          {/* Visión */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-dynamic bg-gray-100 p-6 border-t-4 border-danger-500"
          >
            <h4 className="text-danger-600 font-bold text-xl mb-3">
              Nuestra Visión
            </h4>
            <p className="text-gray-700">
              {institucionalInfo.vision}
            </p>
          </motion.div>
        </div>

        {/* Información adicional */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-dynamic bg-dark-800 text-white p-6 text-center"
          >
            <i className="ti ti-clock text-4xl mb-3 text-cyber-blue"></i>
            <h5 className="font-bold mb-2">Sesiones de Trabajo</h5>
            <p className="text-sm mb-1">{institucionalInfo.sesiones.dia}</p>
            <p className="text-sm text-gray-400">{institucionalInfo.sesiones.lugar}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card-dynamic bg-primary-600 text-white p-6 text-center"
          >
            <i className="ti ti-user text-4xl mb-3"></i>
            <h5 className="font-bold mb-2">Liderazgo Académico</h5>
            <p className="text-sm mb-1">{institucionalInfo.director}</p>
            <p className="text-sm opacity-75">Director de Investigación</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              to="/ieee-unipiloto"
              className="block card-dynamic bg-danger-500 text-white p-6 text-center h-full hover:bg-danger-600"
            >
              <i className="ti ti-plug text-4xl mb-3"></i>
              <h5 className="font-bold mb-2">Capítulo Estudiantil</h5>
              <p className="text-sm mb-1">Vinculados a IEEE</p>
              <p className="text-sm opacity-75 mb-3">Rama Unipiloto</p>
              <span className="inline-block bg-white text-danger-500 px-4 py-1 rounded-full text-sm">
                Ver integrantes →
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Proyectos de Laboratorio */}
      <section id="laboratorio" className="container mx-auto px-4 py-16">
        <h2 className="section-title">Proyectos de Laboratorio</h2>

        {projectsLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-64 rounded-lg"></div>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card-dynamic bg-white shadow-lg overflow-hidden"
              >
                <img
                  src={project.mainImage || 'https://via.placeholder.com/400x250?text=Proyecto+IOT'}
                  alt={project.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h5 className="text-primary-600 font-bold text-lg mb-2">
                    {project.name}
                  </h5>
                  <p className="text-gray-600 text-sm mb-4">
                    {project.shortDesc}
                  </p>
                  <Link
                    to={`/proyecto/${project.id}`}
                    className="inline-block w-full text-center py-2 border-2 border-danger-500 text-danger-500 rounded hover:bg-danger-500 hover:text-white transition-colors"
                  >
                    Detalles Técnicos
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white">No hay proyectos registrados aún.</p>
        )}
      </section>

      {/* Blog / Eventos */}
      <section id="blog" className="container mx-auto px-4 py-16 border-t border-gray-700">
        <h2 className="section-title">Eventos y Bitácoras</h2>

        {postsLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton h-48 rounded-lg"></div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="card-dynamic bg-gray-100 shadow-lg overflow-hidden flex"
              >
                <div className="w-1/3">
                  <img
                    src={post.mainImage || 'https://via.placeholder.com/200x200?text=Evento'}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-6">
                  <h5 className="font-bold text-lg mb-2 text-gray-900">
                    {post.title}
                  </h5>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {post.content.substring(0, 100)}...
                  </p>
                  <Link
                    to={`/noticia/${post.id}`}
                    className="text-danger-500 hover:text-danger-600 text-sm font-semibold"
                  >
                    Leer más →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white">No hay eventos registrados aún.</p>
        )}
      </section>

      {/* Contacto */}
      <section id="contacto" className="container mx-auto px-4 py-16">
        <h2 className="section-title">Contacto</h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto card-dynamic bg-white p-8 text-center"
        >
          <p className="text-gray-700 mb-6">
            ¿Interesado en unirte al semillero o colaborar en nuestros proyectos?
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="mailto:semillero@unipiloto.edu.co"
              className="btn-cyber btn-contact px-8"
            >
              <i className="ti ti-mail"></i>
              Enviar Correo
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyber btn-lab px-8"
            >
              <i className="ti ti-brand-github"></i>
              Ver Repositorios
            </a>
          </div>
        </motion.div>
      </section>
    </>
  );
}
