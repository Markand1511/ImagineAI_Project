const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function getCsrfToken(): string | null {
  const name = 'csrftoken=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return null;
}

interface ApiErrorResponse {
  status?: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const isPost = options.method?.toUpperCase() === 'POST';
  const isDelete = options.method?.toUpperCase() === 'DELETE';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Add CSRF token for state-changing requests
  if (isPost || isDelete) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }
  }

  const response = await fetch(url, {
    headers,
    credentials: 'same-origin',
    ...options,
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  let data: unknown;
  if (isJson) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { message: text || response.statusText };
  }

  if (!response.ok) {
    const errorResponse = data as ApiErrorResponse;
    const message = errorResponse.message || errorResponse.error || `HTTP ${response.status}: ${response.statusText}`;
    const error: Error & { response?: ApiErrorResponse; status?: number } = new Error(message);
    error.response = errorResponse;
    error.status = response.status;
    throw error;
  }

  return data as T;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const apiError = error as Error & { response?: ApiErrorResponse; status?: number };
    if (apiError.response?.message) return apiError.response.message;
    if (apiError.response?.error) return apiError.response.error;
    if (apiError.status === 401) return 'Your session has expired. Please sign in again.';
    if (apiError.status === 403) return 'You do not have permission to perform this action.';
    if (apiError.status === 404) return 'This image is no longer available.';
    if (apiError.status === 429) return 'Too many requests. Please try again later.';
    if (apiError.status && apiError.status >= 500) return 'Something went wrong. Please try again.';
    if (apiError.message && !apiError.message.includes('Unexpected token')) return apiError.message;
    return 'Unable to connect to the server. Please try again.';
  }
  return 'An unexpected error occurred.';
}

export const api = {
  generateImage: (prompt: string) =>
    fetchApi<GenerateImageResponse>('/generate-image/', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }),

  getImages: (page = 1, pageSize = 20) =>
    fetchApi<PaginatedResponse<GeneratedImage>>(
      `/images/?page=${page}&page_size=${pageSize}`
    ),

  getImage: (id: string) =>
    fetchApi<{ status: boolean; message: string; data: GeneratedImage }>(
      `/images/${id}/`
    ),

  deleteImage: (id: string) =>
    fetchApi<{ status: boolean; message: string }>(`/images/${id}/`, {
      method: 'DELETE',
    }),
};

export { getErrorMessage };

import type { GenerateImageResponse, PaginatedResponse, GeneratedImage } from '../types';