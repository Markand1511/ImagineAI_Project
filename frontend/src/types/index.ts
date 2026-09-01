export interface GeneratedImage {
  id: string;
  short_prompt: string;
  image_url: string;
  created_at: string;
  prompt?: string;
}

export interface GenerateImageRequest {
  prompt: string;
}

export interface GenerateImageResponse {
  status: boolean;
  message: string;
  data: GeneratedImage;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    count: number;
    total_pages: number;
    current_page: number;
    next: string | null;
    previous: string | null;
    results: T[];
  };
}

export interface ApiError {
  status: boolean;
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}