import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const isAuthenticated = !!token;

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  }, [token, username]);

  async function loginFn(user, password) {
    const res = await loginApi(user, password);
    setToken(res.data.token);
    setUsername(res.data.username);
    return res.data;
  }

  function logout() {
    setToken(null);
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated, login: loginFn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
