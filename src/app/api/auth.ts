import {apiClient} from './client.ts';
import { parseDRFError, getFirstErrorMessage } from '../utils/drfErrors.ts';

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
    try {
      const response = await apiClient.post<LoginResponse>('/auth/token/login/', {
        phone_number: credentials.phone,
        password: credentials.password,
      });
      apiClient.setAuthToken(response.auth_token);
      return response;
    } catch (error) {
      const parsed = parseDRFError(error);
      const message = getFirstErrorMessage(parsed);
      throw new Error(message);
    }
  },

  async loginStaff(credentials: StaffLoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/token/login/', credentials);
      apiClient.setAuthToken(response.auth_token);
      return response;
    } catch (error) {
      const parsed = parseDRFError(error);
      const message = getFirstErrorMessage(parsed);
      throw new Error(message);
    }
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/users/', {
        initials: data.name,
        phone_number: data.phone,
        email: data.email,
        password: data.password,
      });
      apiClient.setAuthToken(response.auth_token);
      return response;
    } catch (error) {
      const parsed = parseDRFError(error);

      // Для регистрации важно показать все ошибки полей
      if (Object.keys(parsed.fieldErrors).length > 0) {
        const messages = Object.entries(parsed.fieldErrors)
            .map(([field, msgs]) => {
              const fieldName = field.replace(/_/g, ' ');
              return `${fieldName}: ${msgs.join(' ')}`;
            });
        throw new Error(messages.join('; '));
      }

      const message = getFirstErrorMessage(parsed);
      throw new Error(message);
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/token/logout/', {});
    } catch {
      // Игнорируем ошибки при логауте
    }
    apiClient.clearAuthToken();
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await apiClient.get<User>('/auth/users/me/');
      return user;
    } catch {
      return null;
    }
  },

  async refreshToken(): Promise<string> {
    try {
      const response = await apiClient.post<{ token: string }>('/auth/token/refresh/', {});
      apiClient.setAuthToken(response.token);
      return response.token;
    } catch (error) {
      const parsed = parseDRFError(error);
      throw new Error(getFirstErrorMessage(parsed));
    }
  },
};