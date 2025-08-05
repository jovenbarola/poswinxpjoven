import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem('xp-food-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('xp-food-users') || '[]');
      const userExists = existingUsers.find((u: any) => u.email === email || u.username === username);
      
      if (userExists) {
        return false;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        isAdmin: email === 'admin@foodapp.com', // Make admin user
      };

      // Store user credentials (in real app, this would be hashed)
      const userCredentials = { ...newUser, password };
      existingUsers.push(userCredentials);
      localStorage.setItem('xp-food-users', JSON.stringify(existingUsers));

      // Set current user
      setUser(newUser);
      localStorage.setItem('xp-food-user', JSON.stringify(newUser));

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('xp-food-users') || '[]');
      const user = existingUsers.find((u: any) => 
        (u.email === email || u.username === email) && u.password === password
      );

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        setUser(userWithoutPassword);
        localStorage.setItem('xp-food-user', JSON.stringify(userWithoutPassword));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('xp-food-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};