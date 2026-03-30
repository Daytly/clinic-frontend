import { apiClient } from './client';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'client' | 'staff';
  specialistId?: string;
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
  user: User;
  token: string;
}

// Mock database
const mockUsers: Record<string, User & { password: string }> = {
  client: {
    id: '1',
    name: 'Иванова Мария Петровна',
    phone: '+7 (999) 123-45-67',
    email: 'maria.ivanova@example.com',
    password: '123456',
    role: 'client',
  },
  staff: {
    id: '2',
    name: 'Анна Петрова',
    phone: '+7 (999) 100-00-01',
    email: 'anna.petrova@clinic.com',
    password: '123456',
    role: 'staff',
    specialistId: '1',
  },
};

let registeredUsers: Record<string, User & { password: string }> = { ...mockUsers };

// Generate mock JWT token
const generateToken = (userId: string, role: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      userId,
      role,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })
  );
  const signature = btoa(`mock-signature-${userId}-${role}`);
  return `${header}.${payload}.${signature}`;
};

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find user by phone
    const user = Object.values(registeredUsers).find(
      u => u.phone === credentials.phone && u.role === 'client'
    );

    if (!user || user.password !== credentials.password) {
      throw new Error('Неверный телефон или пароль');
    }

    const token = generateToken(user.id, user.role);
    apiClient.setAuthToken(token);

    const { password, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

    return {
      user: userWithoutPassword,
      token,
    };
  },

  async loginStaff(credentials: StaffLoginCredentials): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find staff by email
    const user = Object.values(registeredUsers).find(
      u => u.email === credentials.email && u.role === 'staff'
    );

    if (!user || user.password !== credentials.password) {
      throw new Error('Неверный email или пароль');
    }

    const token = generateToken(user.id, user.role);
    apiClient.setAuthToken(token);

    const { password, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

    return {
      user: userWithoutPassword,
      token,
    };
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if user already exists
    const existingUser = Object.values(registeredUsers).find(
      u => u.phone === data.phone || u.email === data.email
    );

    if (existingUser) {
      throw new Error('Пользователь с таким телефоном или email уже существует');
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email,
      password: data.password,
      role: 'client' as const,
    };

    registeredUsers[newUser.id] = newUser;

    const token = generateToken(newUser.id, newUser.role);
    apiClient.setAuthToken(token);

    const { password, ...userWithoutPassword } = newUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

    return {
      user: userWithoutPassword,
      token,
    };
  },

  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    apiClient.clearAuthToken();
  },

  async getCurrentUser(): Promise<User | null> {
    const token = apiClient.getAuthToken();
    if (!token) return null;

    // Try to get from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    return null;
  },

  async refreshToken(): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const newToken = generateToken(user.id, user.role);
    apiClient.setAuthToken(newToken);

    return newToken;
  },
};
