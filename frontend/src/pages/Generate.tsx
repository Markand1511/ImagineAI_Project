import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGenerateImage } from '../hooks/useImages';
import { Textarea } from '../components/Textarea';
import { Button } from '../components/Button';
import { ArrowRight, Download, ChevronLeft } from 'lucide-react';
import type { GeneratedImage } from '../types';
import { useToast } from '../context/ToastContext';

export function GeneratePage() {
  const { generate, isGenerating } = useGenerateImage();
  const { showToast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 10000;

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      showToast('error', 'Please enter a prompt before generating an image.');
      return;
    }

    const result = await generate(trimmedPrompt);
    if (result) {
      setGeneratedImage(result);
      textareaRef.current?.focus();
    }
  };

  const handleNewGeneration = () => {
    setGeneratedImage(null);
    setPrompt('');
  };

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

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="container-main py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto">
          {!generatedImage ? (
            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
              <div className="text-center space-y-3">
                <h1 className="text-4xl sm:text-5xl font-bold text-text-primary tracking-tight">
                  Create images from your ideas
                </h1>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  Turn a simple description into a detailed visual with AI.
                </p>
              </div>

              <div className="space-y-4">
                <Textarea
                  ref={textareaRef}
                  label="Prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the image you want to create..."
                  helperText={`Maximum ${maxLength.toLocaleString()} characters`}
                  showCharCount
                  maxLength={maxLength}
                  rows={5}
                  disabled={isGenerating}
                  aria-describedby="prompt-hint"
                />
                <p id="prompt-hint" className="text-xs text-text-muted text-center">
                  Press <kbd className="px-1.5 py-0.5 bg-background-card border border-border rounded text-text-secondary">Enter</kbd> to generate, <kbd className="px-1.5 py-0.5 bg-background-card border border-border rounded text-text-secondary">Shift+Enter</kbd> for new line
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isGenerating}
                leftIcon={!isGenerating && <ArrowRight className="w-5 h-5" />}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating image...' : 'Generate Image'}
              </Button>
            </form>
          ) : (
            <div className="animate-slide-up space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-text-primary">Generated Image</h2>
                <Button variant="ghost" size="sm" onClick={handleNewGeneration} leftIcon={<ChevronLeft className="w-4 h-4" />}>
                  New Generation
                </Button>
              </div>

              <div className="relative aspect-square rounded-xl overflow-hidden bg-background-secondary">
                {generatedImage.image_url && (
                  <img
                    src={generatedImage.image_url}
                    alt={`Generated: ${generatedImage.short_prompt}`}
                    className="w-full h-full object-cover"
                  />
                )}
                {!generatedImage.image_url && (
                  <div className="w-full h-full flex items-center justify-center bg-background-secondary">
                    <div className="text-text-muted text-sm">No image available</div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {generatedImage.image_url && (
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<Download className="w-5 h-5" />}
                    onClick={() => handleDownload(generatedImage.image_url, generatedImage.short_prompt || '')}
                  >
                    Download Image
                  </Button>
                )}
                <Button variant="secondary" size="lg" onClick={handleNewGeneration}>
                  Generate Another
                </Button>
              </div>

              <Link
                to={`/generations/${generatedImage.id}`}
                className="block text-center text-accent-primary hover:text-accent-hover text-sm font-medium transition-colors"
              >
                View in My Generations →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}