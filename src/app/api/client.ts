const BASE_URL = 'https://nv89-5kzc-7g7w.gw-1a.dockhost.net/api';

let authToken: string | null = localStorage.getItem('authToken');

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export const apiClient = {
  setAuthToken(token: string) {
    authToken = token;
    localStorage.setItem('authToken', token);
  },

  getAuthToken() {
    return authToken;
  },

  clearAuthToken() {
    authToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  isAuthenticated() {
    return !!authToken;
  },

  async request<T>(
      endpoint: string,
      options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (authToken) {
      headers['Authorization'] = `Token ${authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // если нужна отправка cookies
      });

      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new ApiError(
            data?.message || data?.detail || 'Ошибка запроса',
            response.status,
            data?.errors
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;

      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiError('Не удалось подключиться к серверу. Проверьте, запущен ли бэкенд на localhost:8000', 0);
      }

      throw new ApiError(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
          500
      );
    }
  },

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },
};