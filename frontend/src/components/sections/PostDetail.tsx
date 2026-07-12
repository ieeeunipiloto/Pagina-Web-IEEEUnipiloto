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
        <div className="text-white text-xl">Cargando publicaci&oacute;n...</div>
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
          <p className="text-red-400 text-xl mb-2">Error al cargar publicaci&oacute;n</p>
          <p className="text-gray-400 text-sm mb-6">{errorMessage}</p>
          <Link to="/" className="nav-btn blog">
            <i className="ti ti-arrow-left"></i>
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const allImages = [
    ...(post.mainImage ? [post.mainImage] : []),
    ...post.images.map((img) => img.imageUrl),
  ];

  return (
    <div className="min-h-screen bg-[#030d38]">
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="flex flex-col items-center text-center">
          <div className="max-w-4xl w-full">
            {/* Header with pill badge */}
            <div className="text-left mb-6">
              <div style={{ borderLeft: '5px solid #0891b2', paddingLeft: '16px', marginBottom: '24px' }}>
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
                  {post.eventLink ? 'Evento' : 'Bitácora de Investigación'}
                </span>
                <h1 className="text-2xl md:text-4xl font-extrabold text-white mt-2 leading-tight">
                  {post.title}
                </h1>
                <div className="text-gray-400 mt-1 text-sm">
                  {post.endDate
                    ? `Del ${formatDate(post.startDate)} al ${formatDate(post.endDate)}`
                    : formatDate(post.startDate)
                  }
                </div>
              </div>
            </div>

            {/* Image Carousel */}
            {allImages.length > 0 && (
              <div className="mb-10">
                {allImages.length === 1 ? (
                  <img
                    src={getImageUrl(allImages[0])}
                    alt={post.title}
                    className="w-full rounded"
                    style={{ height: '500px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="flex flex-col gap-4">
                    {allImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={getImageUrl(img)}
                        alt={`${post.title} - imagen ${idx + 1}`}
                        className="w-full rounded"
                        style={{ height: '500px', objectFit: 'cover' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex justify-center">
              <div className="w-full max-w-3xl">
                <div
                  className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap"
                  style={{ textAlign: 'justify' }}
                >
                  {post.content}
                </div>
              </div>
            </div>

            {/* External Link */}
            {post.eventLink && (
              <div className="mt-10 pt-6 text-center">
                <a
                  href={post.eventLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-btn ieee btn-lg"
                  style={{ padding: '12px 32px' }}
                >
                  <i className="ti ti-external-link"></i>
                  M&aacute;s Informaci&oacute;n del Evento
                </a>
              </div>
            )}

            {/* Back button */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <a href="/#blog" className="nav-btn blog">
                <i className="ti ti-pencil"></i>
                Blog
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
