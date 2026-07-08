import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Member } from '@/types';
import { getImageUrl } from '@/utils/config';
import beeComputerImg from '@/assets/Abeja Computador.png';

export default function IEEEInfo() {
  const {
    data: members,
    isPending,
    isError,
  } = useQuery<Member[]>({
    queryKey: ['members'],
    queryFn: () => api.getMembers(),
  });

  const leaders = members?.filter((m) => m.isLeader) ?? [];
  const nonLeaders = members?.filter((m) => !m.isLeader) ?? [];

  return (
    <div className="min-h-screen bg-[#030d38]">
      <div className="container mx-auto px-4 py-20 md:py-28">

        {/* Header: Logo + Title */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-12 pb-8 border-b border-white/10">
          <div className="shrink-0">
            <img
              src={beeComputerImg}
              alt="Logo IEEE Unipiloto"
              className="w-40 md:w-48 object-contain"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Rama Estudiantil IEEE
            </h1>
            <h2 className="text-xl md:text-2xl text-[var(--rojo-lab)] font-semibold mt-1">
              Universidad Piloto de Colombia
            </h2>
            <p className="text-gray-400 mt-2 text-sm md:text-base max-w-xl">
              Fomentando la innovaci&oacute;n tecnol&oacute;gica y la excelencia acad&eacute;mica.
            </p>
          </div>
        </div>

        {/* About IEEE */}
        <div className="grid md:grid-cols-5 gap-8 mb-14">
          <div className="md:col-span-3">
            <h3 className="text-white font-bold text-xl border-l-4 border-[var(--rojo-lab)] pl-4 mb-4">
              IEEE
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              El Instituto de Ingenieros El&eacute;ctricos y Electr&oacute;nicos (IEEE) es la 
              organizaci&oacute;n profesional t&eacute;cnica m&aacute;s grande del mundo dedicada al avance 
              de la tecnolog&iacute;a en beneficio de la humanidad. La Rama Estudiantil IEEE Unipiloto 
              forma parte de esta red global, promoviendo la investigaci&oacute;n, el liderazgo y la 
              innovaci&oacute;n entre los estudiantes de la Universidad Piloto de Colombia.
            </p>
          </div>
          <div className="md:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h5 className="text-white font-bold mb-3">Nuestros Pilares</h5>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-300 text-sm">
                <i className="ti ti-circle-check text-[var(--rojo-lab)]"></i>
                Investigaci&oacute;n Aplicada
              </li>
              <li className="flex items-center gap-2 text-gray-300 text-sm">
                <i className="ti ti-circle-check text-[var(--rojo-lab)]"></i>
                Liderazgo Estudiantil
              </li>
              <li className="flex items-center gap-2 text-gray-300 text-sm">
                <i className="ti ti-circle-check text-[var(--rojo-lab)]"></i>
                &Eacute;tica Profesional (NTC 1486)
              </li>
            </ul>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="mb-10">
          <h3 className="text-white font-bold text-xl border-l-4 border-[#1890ff] pl-4 mb-8 uppercase">
            Equipo de Trabajo
          </h3>

          {isPending ? (
            <div className="space-y-6">
              <div className="skeleton h-48 max-w-2xl mx-auto"></div>
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-64"></div>
                ))}
              </div>
            </div>
          ) : isError ? (
            <div className="text-center py-12 bg-red-900/20 border border-red-500/10 rounded-xl">
              <i className="ti ti-alert-circle text-3xl text-red-400 mb-3 block"></i>
              <p className="text-red-400 text-lg mb-2">Error al cargar miembros</p>
              <p className="text-red-300/60 text-sm">
                No se pudo conectar con el servidor. Verifica que el backend est&eacute; corriendo.
              </p>
            </div>
          ) : (
            <>
              {/* Director / Leaders */}
              {leaders.length > 0 && (
                <div className="flex flex-col items-center gap-6 mb-12">
                  {leaders.map((leader) => (
                    <div key={leader.id} className="w-full max-w-2xl">
                      <div className="card-light p-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                          <div className="shrink-0">
                            <img
                              src={getImageUrl(leader.photo) || 'https://via.placeholder.com/150x150?text=Director'}
                              alt={leader.name}
                              className="foto-director"
                            />
                          </div>
                          <div className="text-center md:text-left">
                            <h3 className="text-gray-900 font-bold text-xl">{leader.name}</h3>
                            <p className="text-[var(--rojo-lab)] font-semibold text-sm mb-2">{leader.role}</p>
                            <p className="text-gray-500 text-sm leading-relaxed">{leader.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Members Grid */}
              {nonLeaders.length > 0 ? (
                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
                  {nonLeaders.map((member) => (
                    <div key={member.id} className="card-light text-center p-6 h-full">
                      <div className="flex flex-col items-center">
                        <img
                          src={getImageUrl(member.photo) || 'https://via.placeholder.com/120x120?text=Miembro'}
                          alt={member.name}
                          className="foto-miembro mb-4"
                        />
                        <h4 className="text-gray-900 font-bold text-base mb-1">{member.name}</h4>
                        <p className="text-[var(--rojo-lab)] text-xs font-semibold mb-2">{member.role}</p>
                        <p className="text-gray-500 text-xs leading-relaxed">{member.description}</p>
                      </div>
                    </div>
                  ))}

                  {/* Join Us placeholder */}
                  <div className="card-light bg-gray-100 text-center p-6 h-full flex flex-col items-center justify-center">
                    <i className="ti ti-user-plus text-5xl text-gray-300 mb-3"></i>
                    <h5 className="text-gray-400 font-bold text-base mb-1">Tu Nombre Aqu&iacute;</h5>
                    <p className="text-gray-400 text-xs">¿Eres estudiante Unipiloto? &iexcl;&Uacute;nete!</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No hay miembros registrados a&uacute;n.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center pt-8 border-t border-white/10">
          <Link to="/#institucional" className="nav-btn contacto">
            <i className="ti ti-home"></i>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
