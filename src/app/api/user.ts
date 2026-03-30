import { apiClient } from './client.ts';
import type { User } from './auth.ts';

export interface UpdateUserData {
  initials?: string;
  email?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userApi = {
  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/users/me/'); // 🔁 поправьте эндпоинт
  },

  async updateProfile(data: UpdateUserData): Promise<User> {
    return apiClient.patch<User>('/auth/users/me/', data); // 🔁 поправьте эндпоинт
  },

  async updatePassword(data: UpdatePasswordData): Promise<void> {
    await apiClient.post('/auth/users/me/change_password/', data); // 🔁 поправьте эндпоинт
  },

  async deleteAccount(): Promise<void> {
    await apiClient.delete('/auth/users/me/'); // 🔁 поправьте эндпоинт
    apiClient.clearAuthToken();
  },
};