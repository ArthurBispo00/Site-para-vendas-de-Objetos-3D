import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { login as loginRequest } from '../services/apiService';
import { tokenStorage } from '../services/tokenStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStorage.get());

  const login = useCallback(async (credentials) => {
    const data = await loginRequest(credentials);
    tokenStorage.set(data.token);
    setToken(data.token);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated: Boolean(token), login, logout }),
    [token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
