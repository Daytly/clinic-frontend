import {apiClient} from './client.ts';

export interface User {
  id: number;
  initials: string;
  phone_number: string;
  email: string;
  is_specialist: boolean;
  education?: string;
  practice?: string;
  link?: string;
  work_email?: string;
  work_methods?: string | string[];
  description?: string;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface StaffLoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  auth_token: string;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/token/login/', {
      phone_number: credentials.phone,
      password: credentials.password,
    });
    apiClient.setAuthToken(response.auth_token);
    return response;
  },

  async loginStaff(credentials: StaffLoginCredentials): Promise<LoginResponse> {
    // 🔁 Замените '/auth/login/staff/' на ваш реальный эндпоинт
    const response = await apiClient.post<LoginResponse>('/auth/token/login/', credentials);
    apiClient.setAuthToken(response.auth_token);
    return response;
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    // 🔁 Замените '/auth/register/' на ваш реальный эндпоинт
    const response = await apiClient.post<LoginResponse>('/auth/users/', {

      initials: data.name,
      phone_number: data.phone,
      email: data.email,
      password: data.password,

    });
    apiClient.setAuthToken(response.auth_token);
    return response;
  },

  async logout(): Promise<void> {
    // 🔁 Опционально: если бэкенд требует запрос на логаут
    try {
      await apiClient.post('/auth/token/logout/', {});
    } catch {
      // Игнорируем ошибки при логауте — всё равно чистим локально
    }
    apiClient.clearAuthToken();
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      // 🔁 Замените '/auth/me/' на ваш эндпоинт получения профиля
      const user = await apiClient.get<User>('/auth/users/me/');
      return user;
    } catch {
      return null;
    }
  },

  async refreshToken(): Promise<string> {
    // 🔁 Замените '/auth/token/refresh/' на ваш эндпоинт
    const response = await apiClient.post<{ token: string }>('/auth/token/refresh/', {});
    apiClient.setAuthToken(response.token);
    return response.token;
  },
};