import { apiClient } from './client';
import type { User } from './auth';

export interface UpdateUserData {
  name?: string;
  phone?: string;
  email?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Mock user storage
const getUserFromStorage = (): (User & { password?: string }) | null => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
};

const saveUserToStorage = (user: User) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const userApi = {
  async getProfile(): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = getUserFromStorage();
    if (!user) {
      throw new Error('Пользователь не авторизован');
    }

    return user;
  },

  async updateProfile(data: UpdateUserData): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = getUserFromStorage();
    if (!user) {
      throw new Error('Пользователь не авторизован');
    }

    // Validate data
    if (data.name && (/\d/.test(data.name) || data.name.trim().split(' ').length < 2)) {
      throw new Error('ФИО должно содержать минимум 2 слова и не содержать цифр');
    }

    if (data.phone && data.phone.replace(/\D/g, '').length !== 11) {
      throw new Error('Номер телефона должен содержать 11 цифр');
    }

    if (data.email && (!data.email.includes('@') || !data.email.includes('.'))) {
      throw new Error('Некорректный формат email');
    }

    // Update user
    const updatedUser = { ...user, ...data };
    saveUserToStorage(updatedUser);

    return updatedUser;
  },

  async updatePassword(data: UpdatePasswordData): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = getUserFromStorage();
    if (!user) {
      throw new Error('Пользователь не авторизован');
    }

    // In a real app, we would verify the current password with the backend
    // For mock purposes, we'll assume it's correct if it's provided
    if (!data.currentPassword) {
      throw new Error('Введите текущий пароль');
    }

    if (data.newPassword.length < 6) {
      throw new Error('Новый пароль должен содержать минимум 6 символов');
    }

    // Mock: Store new password (in real app, this would be hashed on backend)
    const updatedUser = { ...user, password: data.newPassword };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  },

  async deleteAccount(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = getUserFromStorage();
    if (!user) {
      throw new Error('Пользователь не авторизован');
    }

    // Clear user data
    apiClient.clearAuthToken();
    localStorage.removeItem('currentUser');
  },
};
