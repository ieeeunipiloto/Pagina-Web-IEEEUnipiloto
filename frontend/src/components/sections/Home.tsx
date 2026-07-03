import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Hero from './Hero';
import { api } from '@/services/api';
import { Project, Post } from '@/types';
import { institucionalInfo, getImageUrl } from '@/utils/config';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  // Obtener proyectos
  const {
    data: projects,
    isPending: projectsLoading,
    isError: projectsError,
    error: projectsErrorObj,
  } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.getProjects(),
  });

  // Obtener posts
  const {
    data: posts,
    isPending: postsLoading,
    isError: postsError,
    error: postsErrorObj,
  } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () => api.getPosts(),
  });

  const events = posts?.filter((p) => p.eventLink) ?? [];
  const bitacoras = posts?.filter((p) => !p.eventLink) ?? [];
  const recentBitacoras = bitacoras.slice(0, 5);

  // Calendario
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

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
        ) : projectsError ? (
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <p className="text-red-600 text-lg mb-2">Error al cargar proyectos</p>
            <p className="text-red-400 text-sm">
              No se pudo conectar con el servidor. Verifica que el backend esté corriendo.
            </p>
            <p className="text-red-300 text-xs mt-2">
              {projectsErrorObj instanceof Error ? projectsErrorObj.message : 'Error de conexión'}
            </p>
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
                  src={getImageUrl(project.mainImage) || 'https://via.placeholder.com/400x250?text=Proyecto+IOT'}
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

      {/* Eventos */}
      <section id="blog" className="container mx-auto px-4 py-16 border-t border-gray-700">
        <h2 className="section-title">Eventos</h2>

        {postsLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton h-48 rounded-lg"></div>
            ))}
          </div>
        ) : postsError ? (
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <p className="text-red-600 text-lg mb-2">Error al cargar eventos</p>
            <p className="text-red-400 text-sm">No se pudo conectar con el servidor.</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="card-dynamic bg-gray-100 shadow-lg overflow-hidden flex"
              >
                <div className="w-1/3">
                  <img
                    src={getImageUrl(event.mainImage) || 'https://via.placeholder.com/200x200?text=Evento'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-6">
                  <h5 className="font-bold text-lg mb-2 text-gray-900">
                    {event.title}
                  </h5>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {event.content.substring(0, 100)}...
                  </p>
                  <Link
                    to={`/noticia/${event.id}`}
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

      {/* Bitácoras */}
      <section id="bitacoras" className="container mx-auto px-4 py-16 border-t border-gray-700">
        <h2 className="section-title">Bitácoras</h2>

        {postsLoading ? (
          <div className="flex justify-center">
            <div className="skeleton h-48 w-full max-w-md rounded-lg"></div>
          </div>
        ) : postsError ? (
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <p className="text-red-600 text-lg mb-2">Error al cargar bitácoras</p>
            <p className="text-red-400 text-sm">No se pudo conectar con el servidor.</p>
          </div>
        ) : recentBitacoras.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Calendario */}
            <div className="bg-white rounded-lg shadow-lg p-4 h-fit">
              <div className="text-center font-bold text-xl text-primary-600 mb-4">
                {monthNames[month]} {year}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {dayNames.map((d) => (
                  <div key={d} className="text-xs font-semibold text-gray-500 py-1">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map((day, i) =>
                  day !== null ? (
                    <div
                      key={i}
                      className={`text-sm py-1.5 rounded ${
                        day === today.getDate()
                          ? 'bg-danger-500 text-white font-bold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </div>
                  ) : (
                    <div key={i} />
                  )
                )}
              </div>
            </div>

            {/* Lista de bitácoras */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              {recentBitacoras.map((b, idx) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="card-dynamic bg-gray-100 shadow-sm overflow-hidden flex"
                >
                  <div className="w-1/5 min-h-[60px]">
                    <img
                      src={getImageUrl(b.mainImage) || 'https://via.placeholder.com/150x100?text=Bitácora'}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-4/5 p-2 flex flex-col justify-center">
                    <h5 className="font-bold text-xs text-gray-900 leading-tight mb-0.5 line-clamp-1">
                      {b.title}
                    </h5>
                    <p className="text-gray-600 text-[10px] mb-0.5 line-clamp-1">
                      {new Date(b.startDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <Link
                      to={`/noticia/${b.id}`}
                      className="text-danger-500 hover:text-danger-600 text-[10px] font-semibold"
                    >
                      Leer más →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-white">No hay bitácoras registradas aún.</p>
        )}
      </section>

      {/* Contacto */}
      <section id="contacto" className="container mx-auto px-4 py-16">
        <h2 className="section-title">Contacto</h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto card-dynamic bg-white p-8"
        >
          <p className="text-gray-700 mb-6 text-center">
            ¿Interesado en unirte al semillero o colaborar en nuestros proyectos?
          </p>

          <ContactForm />

          <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
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

function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const mutation = useMutation({
    mutationFn: (payload: { email: string; message: string }) => api.sendContact(payload),
    onSuccess: () => {
      setEmail('');
      setMessage('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, message });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
          Tu correo electrónico
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
          Mensaje
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Cuéntanos sobre tu interés en el semillero..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-y text-gray-900"
        />
      </div>

      {mutation.isSuccess && mutation.data && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {mutation.data.message ?? 'Correo enviado exitosamente'}
        </div>
      )}

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {mutation.error instanceof Error ? mutation.error.message : 'Error al enviar el correo'}
        </div>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="btn-cyber btn-contact px-8 w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {mutation.isPending ? (
          <span className="flex items-center justify-center gap-2">
            <i className="ti ti-loader animate-spin"></i>
            Enviando...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <i className="ti ti-mail"></i>
            Enviar Correo
          </span>
        )}
      </button>
    </form>
  );
}
