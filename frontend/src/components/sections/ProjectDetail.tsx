import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Project } from '@/types';

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
          <Link to="/" className="btn-cyber btn-lab">
            <i className="ti ti-arrow-left"></i>
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030d38] py-16">
      <div className="container mx-auto px-4">
        <Link to="/#laboratorio" className="btn-cyber btn-lab mb-8 inline-flex">
          <i className="ti ti-arrow-left"></i>
          Volver a proyectos
        </Link>

        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
          {project.mainImage && (
            <img
              src={project.mainImage}
              alt={project.name}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-8">
            <h1 className="text-4xl font-bold text-primary-600 mb-4">
              {project.name}
            </h1>

            <p className="text-gray-600 text-lg mb-6">
              {project.shortDesc}
            </p>

            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Documentación Técnica
              </h2>
              <div className="text-gray-700 whitespace-pre-wrap">
                {project.documentation}
              </div>
            </div>

            {project.repoUrl && (
              <div className="mb-8">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cyber btn-lab px-8"
                >
                  <i className="ti ti-brand-github"></i>
                  Ver Repositorio
                </a>
              </div>
            )}

            {project.images && project.images.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Galería de Imágenes
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {project.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.imageUrl}
                      alt={`${project.name} - imagen`}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
