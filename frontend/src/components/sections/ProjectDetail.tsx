import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Project } from '@/types';
import { getImageUrl } from '@/utils/config';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: project, isPending, isError, error } = useQuery<Project>({
    queryKey: ['project', id],
    queryFn: () => api.getProjectById(id!),
    enabled: !!id,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#030d38] py-16 flex items-center justify-center">
        <div className="text-white text-xl">Cargando proyecto...</div>
      </div>
    );
  }

  if (isError || !project) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'No se pudo cargar el proyecto. Verifica que el backend esté corriendo.';

    return (
      <div className="min-h-screen bg-[#030d38] py-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-400 text-xl mb-2">Error al cargar proyecto</p>
          <p className="text-gray-400 text-sm mb-6">{errorMessage}</p>
          <Link to="/" className="nav-btn lab">
            <i className="ti ti-arrow-left"></i>
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const startDate = new Date(project.startDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#030d38]">
      <div className="container mx-auto px-4 py-20 md:py-28">

        {/* Header with pill badge */}
        <div className="mb-6">
          <div style={{ borderLeft: '5px solid #0891b2', paddingLeft: '16px' }}>
            <span className="inline-flex items-center gap-1.5" style={{
              background: 'transparent',
              border: '1.5px solid #0891b2',
              color: '#0891b2',
              borderRadius: '999px',
              padding: '3px 12px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              <i className="ti ti-circuit-board"></i>
              Proyecto
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white mt-2 leading-tight">
              {project.name}
            </h1>
          </div>
          <hr className="border-primary-500 border-2 w-1/4 mt-5" />
        </div>

        {/* Main content: two column layout */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left: Documentation */}
          <div className="w-full md:w-3/5">
            <h3 className="text-white text-lg font-bold mb-3">Documentaci&oacute;n T&eacute;cnica</h3>
            <div className="p-6 bg-gray-100 border-l-4 border-[var(--rojo-lab)] rounded shadow-sm">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap" style={{ textAlign: 'justify' }}>
                {project.documentation}
              </p>
            </div>
          </div>

          {/* Right: Image + Meta */}
          <div className="w-full md:w-2/5 flex flex-col gap-4">
            {project.mainImage && (
              <div>
                <img
                  src={getImageUrl(project.mainImage)}
                  alt={project.name}
                  className="w-full max-w-full rounded shadow-lg"
                  style={{ objectFit: 'cover', maxHeight: '400px' }}
                />
              </div>
            )}

            {/* Date badge */}
            <div className="flex items-center gap-2" style={{
              background: '#cccccc',
              border: '2px solid #4b5659',
              color: '#000',
              borderRadius: '999px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 500,
              width: 'fit-content',
            }}>
              <i className="ti ti-calendar-check" style={{ fontSize: '20px' }}></i>
              <span><strong>Fecha de inicio:</strong> {startDate}</span>
            </div>

            {/* Repo button */}
            {project.repoUrl && (
              <div style={{ maxWidth: '300px' }}>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-btn Git text-center w-100"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <i className="ti ti-brand-git"></i>
                  Ver Repositorio (GitHub/GitLab)
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Gallery */}
        {project.images && project.images.length > 0 && (
          <div className="mt-12">
            <h3 className="text-white text-lg font-bold mb-4">Galer&iacute;a de Im&aacute;genes</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {project.images.map((image) => (
                <div key={image.id} className="overflow-hidden rounded shadow-md">
                  <img
                    src={getImageUrl(image.imageUrl)}
                    alt={`${project.name} - imagen`}
                    className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back button */}
        <div className="text-center mt-12 pt-8">
          <a href="/#laboratorio" className="nav-btn lab">
            <i className="ti ti-flask"></i>
            Laboratorio
          </a>
        </div>
      </div>
    </div>
  );
}
