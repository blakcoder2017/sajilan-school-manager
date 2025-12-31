import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'BURSAR' | 'TEACHER';

interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for the prototype
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'proprietor': {
    password: 'admin123',
    user: {
      id: '1',
      username: 'proprietor',
      role: 'SUPER_ADMIN',
      name: 'Dr. Kwame Asante',
    },
  },
  'headmaster': {
    password: 'admin123',
    user: {
      id: '2',
      username: 'headmaster',
      role: 'ADMIN',
      name: 'Mr. Kofi Mensah',
    },
  },
  'bursar': {
    password: 'admin123',
    user: {
      id: '3',
      username: 'bursar',
      role: 'BURSAR',
      name: 'Mrs. Ama Boateng',
    },
  },
  'teacher': {
    password: 'admin123',
    user: {
      id: '4',
      username: 'teacher',
      role: 'TEACHER',
      name: 'Mr. Yaw Darko',
    },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('sajilan_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('sajilan_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const demoUser = DEMO_USERS[username.toLowerCase()];
    if (demoUser && demoUser.password === password) {
      setUser(demoUser.user);
      localStorage.setItem('sajilan_user', JSON.stringify(demoUser.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sajilan_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
