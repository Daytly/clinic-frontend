import {useState} from 'react';
import {authApi, type LoginCredentials, type RegisterData, type User} from '../api/auth.ts';

interface UseAuthResult {
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
}

export function useAuth(): UseAuthResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.login(credentials);
      const response = await authApi.getCurrentUser();
      if (response) {
        return response;
      } else {
        throw new Error('Ошибка входа');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка входа';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.register(data);
      const response = await authApi.getCurrentUser();
      if (response) {
        return response;
      } else {
        throw new Error('Ошибка входа');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка регистрации';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.logout();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка выхода';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUser = async (): Promise<User | null> => {
    try {
      return await authApi.getCurrentUser();
    } catch (err) {
      return null;
    }
  };

  return {
    isLoading,
    error,
    login,
    register,
    logout,
    getCurrentUser,
  };
}
