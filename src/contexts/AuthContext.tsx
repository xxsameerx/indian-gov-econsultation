import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import usersData from '../data/user.json';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        const sessionExpiry = localStorage.getItem('sessionExpiry');
        
        if (savedUser && sessionExpiry) {
          const expiryTime = new Date(sessionExpiry);
          const currentTime = new Date();
          
          if (currentTime < expiryTime) {
            setUser(JSON.parse(savedUser));
          } else {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('sessionExpiry');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionExpiry');
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = usersData.find((u: any) => u.email === email);
      
      if (foundUser && (
        (email === 'admin@gov.in' && password === 'password123') ||
        (email !== 'admin@gov.in' && password === 'password')
      )) {
        setUser(foundUser as User);
        
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 24);
        
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        localStorage.setItem('sessionExpiry', expiryTime.toISOString());
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const existingUser = usersData.find((u: any) => u.email === userData.email);
      if (existingUser) {
        return false;
      }
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email || '',
        name: userData.name || '',
        role: 'citizen',
        location: userData.location || '',
        organization: userData.organization,
        isVerified: false,
        createdAt: new Date().toISOString(),
        avatar: `https://via.placeholder.com/40`,
        phone: userData.phone,
        preferences: {
          language: 'en',
          notifications: true,
          emailUpdates: true
        }
      };
      
      setUser(newUser);
      
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + 24);
      
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('sessionExpiry', expiryTime.toISOString());
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionExpiry');
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
