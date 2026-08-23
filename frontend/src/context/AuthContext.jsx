import { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser, logoutUser, fetchCurrentUser } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const currentUser = await fetchCurrentUser(token);
          setUser(currentUser);
        } catch (error) {
          console.error('Nem sikerült betölteni a felhasználót:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    }

    loadUser();
  }, [token]);

  async function register(name, email, password) {
    const data = await registerUser(name, email, password);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function login(email, password) {
    const data = await loginUser(email, password);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function logout() {
    if (token) {
      await logoutUser(token);
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth csak AuthProvider-en belül használható');
  }
  return context;
}