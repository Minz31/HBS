import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Hardcoded users for testing
const HARDCODED_USERS = [
  {
    id: 1,
    email: 'user@stays.in',
    password: 'password123',
    name: 'Aadesh31',
    role: 'user',
    avatar: null
  },
  {
    id: 2,
    email: 'admin@stays.in',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    avatar: null
  },
  {
    id: 3,
    email: 'owner@stays.in',
    password: 'owner123',
    name: 'Hotel Owner',
    role: 'owner',
    avatar: null
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Login function with hardcoded credentials
  const login = async (email, password) => {
    // Find user in hardcoded list
    const foundUser = HARDCODED_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      const fakeToken = `token_${foundUser.id}_${Date.now()}`;
      
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('token', fakeToken);
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    getUserInitials
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
