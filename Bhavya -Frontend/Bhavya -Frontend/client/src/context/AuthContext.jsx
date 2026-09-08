import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('campusvibe_user');
      const token = localStorage.getItem('campusvibe_token');

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('Failed to load stored auth session:', err);
      localStorage.removeItem('campusvibe_user');
      localStorage.removeItem('campusvibe_token');
    } finally {
      setLoading(false);
    }
  }, []);

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    setUser(data);
    localStorage.setItem('campusvibe_user', JSON.stringify(data));
    localStorage.setItem('campusvibe_token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const login = async (email, password, rememberMe = false) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('campusvibe_user', JSON.stringify(data));
    localStorage.setItem('campusvibe_token', data.token);
    if (!rememberMe) {
      sessionStorage.setItem('campusvibe_session', 'true');
    }
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const googleLogin = async (credential) => {
    const { data } = await api.post('/auth/google', { credential });
    setUser(data);
    localStorage.setItem('campusvibe_user', JSON.stringify(data));
    localStorage.setItem('campusvibe_token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('campusvibe_user');
    localStorage.removeItem('campusvibe_token');
    delete api.defaults.headers.common['Authorization'];
  }, []);

  const verifyStudent = async (studentId) => {
    const { data } = await api.put('/auth/verify', { studentId });
    setUser((prev) => ({ ...prev, ...data.user }));
    localStorage.setItem('campusvibe_user', JSON.stringify({ ...user, ...data.user }));
    return data;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, googleLogin, logout, verifyStudent }}
    >
      {children}
    </AuthContext.Provider>
  );
};
