import { createContext, useContext, useState, useEffect } from 'react';
import customerAPI from '../services/customerAPI';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('user') && localStorage.getItem('token'));
  });
  const [loading, setLoading] = useState(false);

  // Login function using backend API
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await customerAPI.authPage.login(email, password);
      
      // Check if response has token (backend returns AuthResp with jwt and message fields)
      const token = response.jwt || response.token;
      
      if (token && token.trim().length > 0) {
        // Validate token format (should have at least 2 dots for JWT)
        if (!token.includes('.')) {
          console.error('Invalid token format received');
          return { success: false, error: 'Invalid token received from server' };
        }
        
        localStorage.setItem('token', token);
        
        // Extract user info from token or use email
        const userInfo = {
          email: email,
          name: response.name || email.split('@')[0] || 'User',
          role: response.role || response.userRole || 'user'
        };
        
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);
        setIsAuthenticated(true);
        
        return { success: true, user: userInfo };
      }
      
      return { success: false, error: 'Login failed: No token received' };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Invalid email or password';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
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
    if (!user?.name || user.name === 'undefined') return 'U';
    
    // Split by space and filter out any "undefined" or "null" strings that might have crept in
    const names = user.name.split(' ').filter(n => n && n.toLowerCase() !== 'undefined' && n.toLowerCase() !== 'null');
    
    if (names.length === 0) return 'U';
    
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 1).toUpperCase();
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