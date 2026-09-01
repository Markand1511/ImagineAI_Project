import { useState } from 'react';
import type { GeneratedImage } from '../types';

interface ImageCardProps {
  image: GeneratedImage;
  onClick?: () => void;
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const [imageError, setImageError] = useState(false);

  const formattedDate = new Date(image.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <article
      className="card card-hover group"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={`View ${image.short_prompt}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-background-secondary">
        {!imageError && image.image_url && (
          <img
            src={image.image_url}
            alt={`Generated: ${image.short_prompt}`}
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            loading="lazy"
            onError={handleImageError}
          />
        )}
        {imageError || !image.image_url ? (
          <div className="w-full h-full flex items-center justify-center bg-background-secondary">
            <div className="text-text-muted text-xs">No image available</div>
          </div>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {onClick && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-4 py-2 bg-background-primary/90 backdrop-blur text-text-primary text-sm font-medium rounded-lg border border-border shadow-lg">
              View
            </span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <p className="text-text-primary text-sm line-clamp-2 leading-relaxed min-h-[3rem]">
          {image.short_prompt}
        </p>
        <time className="text-text-muted text-xs" dateTime={image.created_at}>
          {formattedDate}
        </time>
      </div>
    </article>
  );
}

interface ImageCardSkeletonProps {
  className?: string;
}

export function ImageCardSkeleton({ className = '' }: ImageCardSkeletonProps) {
  return (
    <article className={`card ${className}`}>
      <div className="aspect-square skeleton rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/4" />
        <div className="h-3 skeleton rounded w-1/2" />
      </div>
    </article>
  );
}