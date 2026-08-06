'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    const savedName = localStorage.getItem('userName');
    if (savedRole) {
      setUser({ name: savedName || 'مستخدم', role: savedRole });
    }
  }, []);

  const loginAsGuest = () => {
    const guestUser = { name: 'زائرة النادي', role: 'guest' };
    setUser(guestUser);
    localStorage.setItem('userRole', 'guest');
    localStorage.setItem('userName', 'زائرة النادي');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);