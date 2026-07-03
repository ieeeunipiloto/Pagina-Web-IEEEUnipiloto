import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Post } from '@/types';
import { getImageUrl } from '@/utils/config';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: post, isPending, isError, error } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: () => api.getPostById(id!),
    enabled: !!id,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#030d38] py-16 flex items-center justify-center">
        <div className="text-white text-xl">Cargando publicación...</div>
      </div>
    );
  }

  if (isError || !post) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'No se pudo cargar la publicación. Verifica que el backend esté corriendo.';

    return (
      <div className="min-h-screen bg-[#030d38] py-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-400 text-xl mb-2">Error al cargar publicación</p>
          <p className="text-gray-400 text-sm mb-6">{errorMessage}</p>
          <Link to="/" className="btn-cyber btn-blog">
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
        <Link to="/#blog" className="btn-cyber btn-blog mb-8 inline-flex">
          <i className="ti ti-arrow-left"></i>
          Volver al blog
        </Link>

        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
          {post.mainImage && (
            <img
              src={getImageUrl(post.mainImage)}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <i className="ti ti-calendar"></i>
                <span>
                  {new Date(post.startDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              {post.endDate && (
                <>
                  <span>-</span>
                  <div className="flex items-center gap-2">
                    <i className="ti ti-calendar"></i>
                    <span>
                      {new Date(post.endDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="prose max-w-none mb-8">
              <div className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                {post.content}
              </div>
            </div>

            {post.eventLink && (
              <div className="mb-8">
                <a
                  href={post.eventLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cyber btn-contact px-8"
                >
                  <i className="ti ti-external-link"></i>
                  Más Información del Evento
                </a>
              </div>
            )}

            {post.images && post.images.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Galería de Imágenes
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {post.images.map((image) => (
                    <img
                      key={image.id}
                      src={getImageUrl(image.imageUrl)}
                      alt={`${post.title} - imagen`}
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
