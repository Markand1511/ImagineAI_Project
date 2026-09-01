import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useImageDetail, useDeleteImage } from '../hooks/useImages';
import { PromptViewer } from '../components/PromptViewer';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ChevronLeft, Download, Trash2, ExternalLink } from 'lucide-react';

export function ImageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { image, isLoading, error } = useImageDetail(id);
  const { deleteImage, isDeleting } = useDeleteImage();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `imagineai-${prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(imageUrl, '_blank');
    }
  };

  const handleDelete = async () => {
    if (!image) return;
    const success = await deleteImage(image.id);
    if (success) {
      setShowDeleteDialog(false);
      navigate('/generations');
    }
  };

  if (isLoading) {
    return (
      <div className="container-main py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={() => navigate('/generations')} leftIcon={<ChevronLeft className="w-4 h-4" />}>
              Back
            </Button>
            <div className="flex-1">
              <div className="h-6 w-1/3 skeleton rounded" />
            </div>
          </div>
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="aspect-[4/3] skeleton rounded-xl" />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="h-12 skeleton rounded-lg w-3/4" />
              <div className="h-40 skeleton rounded-lg" />
              <div className="flex gap-3">
                <div className="h-12 skeleton rounded-lg flex-1" />
                <div className="h-12 skeleton rounded-lg flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="container-main py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/generations')} leftIcon={<ChevronLeft className="w-4 h-4" />}>
              Back
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Image not found</h1>
          <p className="text-text-secondary mb-6">{error || 'The image you\'re looking for doesn\'t exist.'}</p>
          <Button variant="primary" onClick={() => navigate('/generations')}>
            Back to Generations
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(image.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const hasImage = !!image.image_url;

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="container-main py-12">
        <div className="max-w-5xl mx-auto animate-fade-in">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/generations')}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Back to Generations
            </Button>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-background-secondary">
                {hasImage && !imageError && (
                  <img
                    src={image.image_url}
                    alt={`Generated: ${image.prompt || image.short_prompt}`}
                    className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300 ease-out"
                    onError={() => setImageError(true)}
                  />
                )}
                {(imageError || !hasImage) && (
                  <div className="w-full h-full flex items-center justify-center bg-background-secondary">
                    <div className="text-text-muted text-sm">No image available</div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-text-primary">Details</h2>
                  {hasImage && (
                    <a
                      href={image.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost p-2"
                      aria-label="Open image in new tab"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
                <p className="text-text-muted text-sm">Created {formattedDate}</p>
              </div>

              <PromptViewer prompt={image.prompt || image.short_prompt} maxLines={5} />

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                {hasImage && (
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth={false}
                    className="flex-1"
                    leftIcon={<Download className="w-5 h-5" />}
                    onClick={() => handleDownload(image.image_url!, image.prompt || image.short_prompt)}
                  >
                    Download Image
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="lg"
                  fullWidth={false}
                  className="flex-1"
                  leftIcon={<Trash2 className="w-5 h-5" />}
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}