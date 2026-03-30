import { apiClient } from './client.ts';

export interface Session {
  id: string;
  specialistId: string;
  specialistName: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  status?: 'confirmed' | 'pending' | 'cancelled';
}

export interface BookingData {
  specialistId: string;
  specialistName: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
}

export const bookingApi = {
  async createBooking(data: BookingData): Promise<Session> {
    // 🔁 Ваш эндпоинт, например: '/bookings/create/'
    return apiClient.post<Session>('/bookings/create/', data);
  },

  async getUserSessions(): Promise<Session[]> {
    // 🔁 Ваш эндпоинт, например: '/bookings/my/'
    return apiClient.get<Session[]>('/bookings/my/');
  },

  async getSpecialistSessions(specialistId: string): Promise<Session[]> {
    // 🔁 Ваш эндпоинт, например: `/bookings/specialist/${specialistId}/`
    return apiClient.get<Session[]>(`/bookings/specialist/${specialistId}/`);
  },

  async updateSessionStatus(
      sessionId: string,
      status: 'confirmed' | 'pending' | 'cancelled'
  ): Promise<Session> {
    // 🔁 Ваш эндпоинт, например: `/bookings/${sessionId}/status/`
    return apiClient.patch<Session>(`/bookings/${sessionId}/status/`, { status });
  },

  async cancelSession(sessionId: string): Promise<void> {
    // 🔁 Ваш эндпоинт, например: `/bookings/${sessionId}/cancel/`
    await apiClient.post(`/bookings/${sessionId}/cancel/`, {});
  },

  async getAvailableSlots(specialistId: string, date: string): Promise<string[]> {
    // 🔁 Ваш эндпоинт, например: `/bookings/slots/?specialist=${specialistId}&date=${date}`
    return apiClient.get<string[]>(`/bookings/slots/?specialist=${specialistId}&date=${encodeURIComponent(date)}`);
  },
};