/**
 * Home.tsx — Página principal (landing page) del semillero.
 *
 * Componente de página que compone y organiza todas las secciones:
 * 1. Hero: encabezado con escena 3D y llamado a la acción.
 * 2. Institucional: misión, visión, información del semillero.
 * 3. Laboratorio: grilla de proyectos con fetch vía React Query.
 * 4. Eventos: lista de eventos próximos.
 * 5. Bitácoras: calendario del mes + últimas bitácoras.
 * 6. Contacto: formulario de contacto con envío por email.
 *
 * Estados cubiertos por cada sección:
 * - Loading: muestra skeletons animados mientras carga.
 * - Error: muestra mensaje de error con detalles del backend.
 * - Vacío: muestra texto informativo cuando no hay datos.
 * - Datos: renderiza el contenido normalmente.
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import Hero from './Hero';
import { api } from '@/services/api';
import { Project, Post } from '@/types';
import { institucionalInfo, getImageUrl } from '@/utils/config';
import beeScientificImg from '@/assets/Abeja Científica.png';
import beeEngineerImg from '@/assets/Abeja Ingeniera.png';
import beePensiveImg from '@/assets/Abeja Pensativa Lápiz.png';
import beeAwardImg from '@/assets/Abeja Premio 2.png';
import beeHappyImg from '@/assets/Abeja_Feliz.png';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Home — Página principal del sitio.
 * Renderiza todas las secciones de la landing page.
 *
 * @returns {JSX.Element} Página principal completa
 */
export default function Home() {
  // ──────────────────────────────────────────────
  // PETICIONES A LA API
  // ──────────────────────────────────────────────

  /** Consulta: obtener todos los proyectos */
  const {
    data: projects,
    isPending: projectsLoading,
    isError: projectsError,
  } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.getProjects(),
  });

  /** Consulta: obtener todos los posts (eventos + bitácoras) */
  const {
    data: posts,
    isPending: postsLoading,
    isError: postsError,
  } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () => api.getPosts(),
  });

  // Separar posts por tipo según si tienen eventLink
  const events = posts?.filter((p) => p.eventLink) ?? [];
  const bitacoras = posts?.filter((p) => !p.eventLink) ?? [];
  const recentBitacoras = bitacoras.slice(0, 5);

  // ──────────────────────────────────────────────
  // LÓGICA DEL CALENDARIO
  // ──────────────────────────────────────────────

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  };

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  }, [location]);

  return (
    <>
      <Hero />

      {/* INSTITUCIONAL */}
      <section id="institucional" className="container mx-auto px-4 py-20 md:py-28">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="bee-glow bee-glow-azul mb-5">
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              src={beeScientificImg}
              alt="Abeja Mascota del Semillero"
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
            />
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
            Conoce el Semillero IoT e ITSS
          </h2>
          <div className="section-divider" />
          <p className="text-gray-400 mt-4 text-sm md:text-base max-w-xl">
            Innovaci&oacute;n, tecnolog&iacute;a e investigaci&oacute;n aplicada
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card-light p-7 card-accent-top azul"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <i className="ti ti-bullseye text-primary-600 text-lg"></i>
              </div>
              <h4 className="text-primary-600 font-bold text-lg">
                Nuestra Misión
              </h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {institucionalInfo.mision}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card-light p-7 card-accent-top rojo"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <i className="ti ti-eye text-[var(--rojo-lab)] text-lg"></i>
              </div>
              <h4 className="text-[var(--rojo-lab)] font-bold text-lg">
                Nuestra Visión
              </h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {institucionalInfo.vision}
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-glass p-7 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyber-blue/10 flex items-center justify-center mx-auto mb-4">
              <i className="ti ti-clock text-cyber-blue text-2xl"></i>
            </div>
            <h5 className="font-semibold mb-2 text-white">Sesiones de Trabajo</h5>
            <p className="text-sm text-gray-400">{institucionalInfo.sesiones.dia}</p>
            <p className="text-sm text-gray-500">{institucionalInfo.sesiones.lugar}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card-moderno bg-primary-600 text-white p-7 text-center hover:shadow-[0_12px_40px_rgba(9,109,217,0.3)] hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4">
              <i className="ti ti-user text-white text-2xl"></i>
            </div>
            <h5 className="font-semibold mb-1">Liderazgo Académico</h5>
            <p className="text-sm text-white/90">{institucionalInfo.director}</p>
            <p className="text-sm text-white/60">Director de Investigación</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/ieee-unipiloto"
              className="block card-moderno bg-[var(--rojo-lab)] text-white p-7 text-center h-full hover:shadow-[0_12px_40px_rgba(220,53,69,0.3)] hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4">
                <i className="ti ti-plug text-white text-2xl"></i>
              </div>
              <h5 className="font-semibold mb-1">Capítulo Estudiantil</h5>
              <p className="text-sm text-white/90">Vinculados a IEEE</p>
              <p className="text-sm text-white/60 mb-4">Rama Unipiloto</p>
              <span className="inline-block bg-white text-[var(--rojo-lab)] px-5 py-1.5 rounded-full text-sm font-semibold transition-transform hover:scale-105">
                Ver integrantes &rarr;
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PROYECTOS DE LABORATORIO */}
      <section id="laboratorio" className="container mx-auto px-4 py-20 md:py-28">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="bee-glow bee-glow-rojo mb-5">
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              src={beeEngineerImg}
              alt="Abeja Ingeniera del Semillero"
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
            />
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
            Proyectos de Laboratorio
          </h2>
          <div className="section-divider" />
          <p className="text-gray-400 mt-4 text-sm md:text-base max-w-xl">
            Explorando soluciones IoT, gemelos digitales y m&aacute;s
          </p>
        </div>

        {projectsLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-72"></div>
            ))}
          </div>
        ) : projectsError ? (
          <div className="text-center py-12 bg-red-900/20 border border-red-500/10 rounded-xl">
            <i className="ti ti-alert-circle text-3xl text-red-400 mb-3 block"></i>
            <p className="text-red-400 text-lg mb-2">Error al cargar proyectos</p>
            <p className="text-red-300/60 text-sm">
              No se pudo conectar con el servidor. Verifica que el backend est&eacute; corriendo.
            </p>
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="card-proyecto"
              >
                <div className="overflow-hidden">
                  <img
                    src={getImageUrl(project.mainImage) || 'https://via.placeholder.com/400x250?text=Proyecto+IOT'}
                    alt={project.name}
                  />
                </div>
                <div className="p-6 card-body">
                  <h5 className="text-gray-900 font-bold text-lg mb-2 leading-snug">
                    {project.name}
                  </h5>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                    {project.shortDesc}
                  </p>
                  <Link
                    to={`/proyecto/${project.id}`}
                    className="block w-full py-2.5 border-2 border-[var(--rojo-lab)] text-[var(--rojo-lab)] text-sm font-semibold text-center hover:bg-[var(--rojo-lab)] hover:text-white transition-all duration-200"
                  >
                    Detalles T&eacute;cnicos
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No hay proyectos registrados a&uacute;n.</p>
        )}
      </section>

      {/* EVENTOS Y BITÁCORAS */}
      <section id="blog" className="container mx-auto px-4 py-20 md:py-28">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="bee-glow bee-glow-verde mb-5">
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              src={beePensiveImg}
              alt="Abeja Pensativa del Semillero"
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
            />
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
            Eventos y Bit&aacute;coras
          </h2>
          <div className="section-divider" />
        </div>

        {postsLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton h-48"></div>
            ))}
          </div>
        ) : postsError ? (
          <div className="text-center py-12 bg-red-900/20 border border-red-500/10 rounded-xl">
            <i className="ti ti-alert-circle text-3xl text-red-400 mb-3 block"></i>
            <p className="text-red-400 text-lg mb-2">Error al cargar eventos</p>
            <p className="text-red-300/60 text-sm">No se pudo conectar con el servidor.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {events.length > 0 ? (
              events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="post-card flex overflow-hidden bg-gray-100 border border-gray-200 shadow-sm"
                >
                  <div className="w-2/5 min-h-[180px] overflow-hidden">
                    <img
                      src={getImageUrl(event.mainImage) || 'https://via.placeholder.com/200x200?text=Evento'}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="w-3/5 p-4 flex flex-col">
                    <h5 className="font-bold text-gray-900 text-base mb-1 leading-snug line-clamp-2">
                      {event.title}
                    </h5>
                    <small className="text-[var(--rojo-lab)] font-semibold mb-2">
                      {new Date(event.startDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </small>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed flex-grow-1">
                      {event.content.substring(0, 120)}...
                    </p>
                    <Link
                      to={`/noticia/${event.id}`}
                      className="text-primary-600 hover:text-primary-700 text-xs font-semibold transition-colors"
                    >
                      Leer publicaci&oacute;n &rarr;
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-400 md:col-span-2 py-8">No hay eventos registrados a&uacute;n.</p>
            )}
          </div>
        )}

        {/* BITÁCORAS */}
        <div className="border-t border-white/5 pt-16">
          <div className="flex flex-col items-center text-center mb-10">
            <span className="bee-glow bee-glow-cyan mb-4">
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                src={beeAwardImg}
                alt="Abeja Premio del Semillero"
                className="w-20 h-20 md:w-24 md:h-24 object-contain"
              />
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Bit&aacute;coras
            </h3>
            <p className="text-gray-500 mt-2 text-sm">
              Registros y aprendizajes del semillero
            </p>
          </div>

          {postsLoading ? (
            <div className="flex justify-center">
              <div className="skeleton h-48 w-full max-w-md"></div>
            </div>
          ) : postsError ? (
            <div className="text-center py-12 bg-red-900/20 border border-red-500/10 rounded-xl">
              <i className="ti ti-alert-circle text-3xl text-red-400 mb-3 block"></i>
              <p className="text-red-400 text-lg mb-2">Error al cargar bit&aacute;coras</p>
              <p className="text-red-300/60 text-sm">No se pudo conectar con el servidor.</p>
            </div>
          ) : recentBitacoras.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card-light p-5 h-fit">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={prevMonth}
                    className="text-primary-600 hover:text-primary-700 transition-colors p-1 rounded hover:bg-primary-50"
                  >
                    <i className="ti ti-chevron-left text-lg"></i>
                  </button>
                  <div className="text-center font-bold text-lg text-primary-600">
                    {monthNames[calMonth]} {calYear}
                  </div>
                  <button
                    onClick={nextMonth}
                    className="text-primary-600 hover:text-primary-700 transition-colors p-1 rounded hover:bg-primary-50"
                  >
                    <i className="ti ti-chevron-right text-lg"></i>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-center mb-2">
                  {dayNames.map((d) => (
                    <div key={d} className="text-[10px] font-semibold text-gray-400 py-1">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-center">
                  {calendarDays.map((day, i) =>
                    day !== null ? (
                      <div
                        key={i}
                        className={`text-xs py-1.5 rounded ${
                          day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()
                            ? 'bg-[var(--rojo-lab)] text-white font-bold'
                            : 'text-gray-600 hover:bg-gray-50 transition-colors'
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

              <div className="md:col-span-2 flex flex-col gap-2.5">
                {recentBitacoras.map((b, idx) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="post-card flex overflow-hidden bg-gray-100 border border-gray-200 shadow-sm"
                  >
                    <div className="w-[88px] min-h-[68px] overflow-hidden shrink-0">
                      <img
                        src={getImageUrl(b.mainImage) || 'https://via.placeholder.com/150x100?text=Bitácora'}
                        alt={b.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
                      <h5 className="font-semibold text-sm text-gray-900 leading-tight mb-0.5 truncate">
                        {b.title}
                      </h5>
                      <p className="text-gray-500 text-[11px] mb-1">
                        {new Date(b.startDate).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <Link
                        to={`/noticia/${b.id}`}
                        className="text-primary-600 hover:text-primary-700 text-[11px] font-semibold transition-colors"
                      >
                        Leer publicaci&oacute;n &rarr;
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-400">No hay bit&aacute;coras registradas a&uacute;n.</p>
          )}
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="container mx-auto px-4 py-20 md:py-28">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="bee-glow bee-glow-rosa mb-5">
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              src={beeHappyImg}
              alt="Abeja Feliz del Semillero"
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
            />
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
            Registro
          </h2>
          <div className="section-divider" />
          <p className="text-gray-400 mt-4 text-sm md:text-base max-w-xl">
            Cont&aacute;ctanos y s&eacute; parte del semillero
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <div className="card-light p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                <i className="ti ti-mail text-pink-500 text-lg"></i>
              </div>
              <div>
                <h4 className="text-gray-900 font-semibold">Cont&aacute;ctanos</h4>
                <p className="text-gray-500 text-xs">&iquest;Interesado en unirte o colaborar?</p>
              </div>
            </div>
            <ContactForm />
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-600 mb-1.5">
          Tu correo electr&oacute;nico
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-gray-900 transition-all duration-200 text-sm"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-600 mb-1.5">
          Mensaje
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Cu&eacute;ntanos sobre tu inter&eacute;s en el semillero..."
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-y text-gray-900 transition-all duration-200 text-sm"
        />
      </div>

      {mutation.isSuccess && mutation.data && (
        <div className="bg-green-50/80 border border-green-200/50 text-green-700 px-4 py-3 rounded-xl text-sm">
          <i className="ti ti-check-circle text-green-500 mr-2"></i>
          {mutation.data.message ?? 'Correo enviado exitosamente'}
        </div>
      )}

      {mutation.isError && (
        <div className="bg-red-50/80 border border-red-200/50 text-red-700 px-4 py-3 rounded-xl text-sm">
          <i className="ti ti-alert-circle text-red-500 mr-2"></i>
          {mutation.error instanceof Error ? mutation.error.message : 'Error al enviar el correo'}
        </div>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-semibold hover:from-pink-600 hover:to-pink-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_14px_rgba(219,39,119,0.25)] hover:shadow-[0_6px_20px_rgba(219,39,119,0.35)]"
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
