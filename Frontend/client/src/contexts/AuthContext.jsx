import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('me');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const fetchMe = async () => {
    const token = localStorage.getItem('token');
    if (!token) return setUser(null);
    setLoading(true);
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data);
      try { localStorage.setItem('me', JSON.stringify(res.data)); } catch {console.warn('Failed to cache user data'); }
    } catch (err) {
        console.error('Failed to fetch user info', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // if a token exists but no cached user, fetch
    if (localStorage.getItem('token') && !user) {
      fetchMe();
    }

    const onStorage = (e) => {
      if (e.key === 'token' && !e.newValue) {
        // logged out in another tab
        setUser(null);
  try { localStorage.removeItem('me'); } catch { /* ignore */ }
      }
      if (e.key === 'me') {
  try { setUser(e.newValue ? JSON.parse(e.newValue) : null); } catch { setUser(null); }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (token) => {
    if (!token) return;
    localStorage.setItem('token', token);
    await fetchMe();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  try { localStorage.removeItem('me'); } catch { /* ignore */ }
    // notify other tabs
  try { localStorage.setItem('logout', Date.now().toString()); localStorage.removeItem('logout'); } catch { /* ignore */ }
  };

  const updateUser = (u) => {
    setUser(u);
  try { localStorage.setItem('me', JSON.stringify(u)); } catch { /* ignore */ }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
