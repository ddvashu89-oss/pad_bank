import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginRequest } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('padbank_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('padbank_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('padbank_user');
    }
  }, [user]);

  async function login(email, password) {
    setLoading(true);
    try {
      const { token, user: loggedInUser } = await loginRequest(email, password);
      localStorage.setItem('padbank_token', token);
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('padbank_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
