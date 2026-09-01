import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useImages } from '../hooks/useImages';
import { ImageCard, ImageCardSkeleton } from '../components/ImageCard';
import { Image } from 'lucide-react';

export function MyGenerationsPage() {
  const { images, isLoading, isLoadingMore, error, hasMore, totalCount, loadMoreRef, refresh } = useImages();

  const columns = useMemo(() => {
    if (typeof window === 'undefined') return 'grid-cols-5';
    const width = window.innerWidth;
    if (width < 640) return 'grid-cols-3';
    if (width < 1024) return 'grid-cols-4';
    return 'grid-cols-5';
  }, [images.length]);

  if (isLoading) {
    return (
      <div className="container-main py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary">My Generations</h1>
        </div>
        <div className={`grid gap-4 ${columns}`}>
          {Array.from({ length: 15 }).map((_, i) => (
            <ImageCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className="container-main py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary">My Generations</h1>
        </div>
        <div className="text-center py-16">
          <Image className="w-16 h-16 mx-auto text-text-muted mb-4" />
          <h2 className="text-xl font-medium text-text-primary mb-2">Unable to load images</h2>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">{error}</p>
          <button onClick={refresh} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">My Generations</h1>
          <p className="text-text-secondary mt-1">
            View and manage your previously generated images.
            {totalCount > 0 && <span className="ml-2 text-text-muted">({totalCount} total)</span>}
          </p>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-16">
          <Image className="w-16 h-16 mx-auto text-text-muted mb-4" />
          <h2 className="text-xl font-medium text-text-primary mb-2">No images yet</h2>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Create your first AI-generated image and it will appear here.
          </p>
          <Link to="/" className="btn-primary inline-flex">
            Generate Image
          </Link>
        </div>
      ) : (
        <>
          <div className={`grid gap-4 ${columns}`} role="list" aria-label="Generated images">
            {images.map((image) => (
              <Link
                key={image.id}
                to={`/generations/${image.id}`}
                className="block"
              >
                <ImageCard image={image} />
              </Link>
            ))}
          </div>

          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isLoadingMore && (
                <div className="flex items-center gap-3 text-text-secondary">
                  <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                  <span>Loading more images...</span>
                </div>
              )}
            </div>
          )}

          {!hasMore && images.length > 0 && (
            <div className="text-center py-8 text-text-muted text-sm">
              You've reached the end of your gallery.
            </div>
          )}
        </>
      )}
    </div>
  );
}