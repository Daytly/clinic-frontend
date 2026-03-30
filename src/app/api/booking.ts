import { apiClient } from './client';

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

// Mock sessions storage
const SESSIONS_KEY = 'mockSessions';

const getSessionsFromStorage = (): Session[] => {
  const stored = localStorage.getItem(SESSIONS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  // Default sessions
  const defaultSessions: Session[] = [
    {
      id: '1',
      date: '15 марта 2024',
      specialistId: '1',
      specialistName: 'Анна Петрова',
      time: '14:00',
      clientName: 'Иванова Мария',
      clientPhone: '+7 (999) 123-45-67',
      status: 'confirmed',
    },
    {
      id: '2',
      date: '20 марта 2024',
      specialistId: '2',
      specialistName: 'Иван Сидоров',
      time: '11:00',
      clientName: 'Петров Иван',
      clientPhone: '+7 (999) 234-56-78',
      status: 'confirmed',
    },
    {
      id: '3',
      date: '25 марта 2024',
      specialistId: '3',
      specialistName: 'Мария Кузнецова',
      time: '16:00',
      clientName: 'Сидорова Анна',
      clientPhone: '+7 (999) 345-67-89',
      status: 'pending',
    },
    {
      id: '4',
      date: '18 марта 2024',
      specialistId: '1',
      specialistName: 'Анна Петрова',
      time: '10:00',
      clientName: 'Кузнецов Петр',
      clientPhone: '+7 (999) 456-78-90',
      status: 'confirmed',
    },
    {
      id: '5',
      date: '22 марта 2024',
      specialistId: '1',
      specialistName: 'Анна Петрова',
      time: '15:00',
      clientName: 'Волкова Елена',
      clientPhone: '+7 (999) 567-89-01',
      status: 'confirmed',
    },
  ];

  localStorage.setItem(SESSIONS_KEY, JSON.stringify(defaultSessions));
  return defaultSessions;
};

const saveSessionsToStorage = (sessions: Session[]) => {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const bookingApi = {
  async createBooking(data: BookingData): Promise<Session> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const sessions = getSessionsFromStorage();

    // Create new session
    const newSession: Session = {
      id: `session-${Date.now()}`,
      ...data,
      status: 'pending',
    };

    sessions.push(newSession);
    saveSessionsToStorage(sessions);

    return newSession;
  },

  async getUserSessions(userId?: string): Promise<Session[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const sessions = getSessionsFromStorage();

    // In a real app, we would filter by userId from the backend
    // For mock, we return all sessions
    return sessions.sort((a, b) => {
      // Sort by date (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  },

  async getSpecialistSessions(specialistId: string): Promise<Session[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const sessions = getSessionsFromStorage();

    return sessions
      .filter(session => session.specialistId === specialistId)
      .sort((a, b) => {
        // Sort by date (newest first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  },

  async updateSessionStatus(
    sessionId: string,
    status: 'confirmed' | 'pending' | 'cancelled'
  ): Promise<Session> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const sessions = getSessionsFromStorage();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);

    if (sessionIndex === -1) {
      throw new Error('Сессия не найдена');
    }

    sessions[sessionIndex].status = status;
    saveSessionsToStorage(sessions);

    return sessions[sessionIndex];
  },

  async cancelSession(sessionId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const sessions = getSessionsFromStorage();
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    saveSessionsToStorage(updatedSessions);
  },

  async getAvailableSlots(specialistId: string, date: string): Promise<string[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const sessions = getSessionsFromStorage();

    // Get booked times for this specialist on this date
    const bookedTimes = sessions
      .filter(s => s.specialistId === specialistId && s.date === date)
      .map(s => s.time);

    // Generate available time slots (9:00 - 18:00, hourly)
    const allSlots = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
    ];

    return allSlots.filter(slot => !bookedTimes.includes(slot));
  },
};
