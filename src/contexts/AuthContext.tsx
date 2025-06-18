
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  provider: 'email' | 'google';
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem('fittrack-user');
    const userExpiry = localStorage.getItem('fittrack-user-expiry');
    
    if (savedUser) {
      try {
        // Check if user session has expired (for 30-day remember me)
        if (userExpiry) {
          const expiryDate = new Date(userExpiry);
          const now = new Date();
          
          if (now > expiryDate) {
            // Session expired, remove user data
            localStorage.removeItem('fittrack-user');
            localStorage.removeItem('fittrack-user-expiry');
            return;
          }
        }
        
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('fittrack-user');
        localStorage.removeItem('fittrack-user-expiry');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // Note: The actual localStorage setting is handled in LoginModal 
    // to manage the 30-day expiry properly
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fittrack-user');
    localStorage.removeItem('fittrack-user-expiry');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
