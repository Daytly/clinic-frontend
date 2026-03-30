import {createContext, type ReactNode, useContext, useEffect, useState} from 'react';
import type {User} from '../api/auth.ts';
import type {Specialist} from '../api/specialists.ts';
import {specialistsApi} from '../api/specialists.ts';
import {useAuth} from '../hooks/useAuth.ts';
import {useProfile} from '../hooks/useProfile.ts';

interface AppContextType {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isStaff: boolean;

  // Auth actions
  login: (phone: string, password: string) => Promise<User>;
  register: (name: string, phone: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  // Profile actions
  updateUser: (updates: Partial<User>) => Promise<void>;
  updatePassword: (email: string, currentPassword: string, newPassword: string) => Promise<void>;

  // Specialists
  specialists: Specialist[];
  specialistsLoading: boolean;
  specialistsError: string | null;

  // Loading states
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [specialistsLoading, setSpecialistsLoading] = useState(true);
  const [specialistsError, setSpecialistsError] = useState<string | null>(null);

  const auth = useAuth();
  const profile = useProfile();

  // Initialize user and specialists on mount
  useEffect(() => {
    const initUser = async () => {
      try {
        const currentUser = await auth.getCurrentUser();
        if (currentUser) setUser(currentUser);
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const initSpecialists = async () => {
      try {
        const data = await specialistsApi.getAll();
        setSpecialists(data);
      } catch (err) {
        setSpecialistsError(err instanceof Error ? err.message : 'Ошибка загрузки специалистов');
      } finally {
        setSpecialistsLoading(false);
      }
    };

    initUser();
    initSpecialists();
  }, []);

  const login = async (phone: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const loggedInUser = await auth.login({phone: phone, password});
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, phone: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await auth.register({ name, phone, email, password });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await auth.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updatedUser = await profile.updateProfile(updates);
      setUser(updatedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (email: string, currentPassword: string, newPassword: string) => {
    if (!user) return;
    
    // Verify email matches current user
    if (user.email !== email) {
      throw new Error('Email не совпадает с текущим пользователем');
    }
    
    setIsLoading(true);
    try {
      await profile.updatePassword({ currentPassword, newPassword });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isStaff: user?.is_specialist || false,
        login,
        register,
        logout,
        updateUser,
        updatePassword,
        specialists,
        specialistsLoading,
        specialistsError,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
