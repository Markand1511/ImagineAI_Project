import { useState, useCallback, useRef, useEffect } from 'react';
import { api, getErrorMessage } from '../api';
import type { GeneratedImage } from '../types';
import { useToast } from '../context/ToastContext';

export function useImages() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const { showToast } = useToast();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchImages = useCallback(
    async (page: number, append = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await api.getImages(page, 20);

        if (!isMountedRef.current) return;

        if (response.status && response.data) {
          const newImages = response.data.results;
          const hasNextPage = !!response.data.next;

          if (append) {
            setImages((prev) => [...prev, ...newImages]);
          } else {
            setImages(newImages);
          }

          setCurrentPage(response.data.current_page);
          setTotalCount(response.data.count);
          setHasMore(hasNextPage);
        } else {
          throw new Error(response.message || 'Failed to fetch images');
        }
      } catch (err) {
        if (!isMountedRef.current) return;
        const message = getErrorMessage(err);
        setError(message);
        if (!append) {
          showToast('error', message);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchImages(1, false);
  }, [fetchImages]);

  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore) {
          fetchImages(currentPage + 1, true);
        }
      },
      { rootMargin: '200px', threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, currentPage, fetchImages]);

  const refresh = useCallback(() => {
    fetchImages(1, false);
  }, [fetchImages]);

  return {
    images,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    totalCount,
    loadMoreRef,
    refresh,
  };
}

export function useImageDetail(id: string | undefined) {
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const fetchImage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.getImage(id);
        if (mounted && response.status && response.data) {
          setImage(response.data);
        } else if (mounted) {
          throw new Error(response.message || 'Image not found');
        }
      } catch (err) {
        if (mounted) {
          const message = getErrorMessage(err);
          setError(message);
          showToast('error', message);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      mounted = false;
    };
  }, [id, showToast]);

  return { image, isLoading, error };
}

export function useGenerateImage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { showToast } = useToast();

  const generate = useCallback(
    async (prompt: string): Promise<GeneratedImage | null> => {
      setIsGenerating(true);

      try {
        const response = await api.generateImage(prompt);
        if (response.status && response.data) {
          showToast('success', 'Image generated successfully');
          return response.data;
        } else {
          throw new Error(response.message || 'Generation failed');
        }
      } catch (err) {
        const message = getErrorMessage(err);
        showToast('error', message);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [showToast]
  );

  return { generate, isGenerating };
}

export function useDeleteImage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const deleteImage = useCallback(
    async (id: string): Promise<boolean> => {
      setIsDeleting(true);

      try {
        const response = await api.deleteImage(id);
        if (response.status) {
          showToast('success', 'Image deleted successfully');
          return true;
        } else {
          throw new Error(response.message || 'Failed to delete image');
        }
      } catch (err) {
        const message = getErrorMessage(err);
        showToast('error', message);
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [showToast]
  );

  return { deleteImage, isDeleting };
}