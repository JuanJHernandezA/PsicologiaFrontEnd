import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { validateToken } from '../api';
import { decodeToken, isTokenExpired, type DecodedToken } from '../utils/jwt';

export type UserRole = 'Estudiante' | 'Administrador' | 'Psicologo';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: DecodedToken | null;
  role: UserRole | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateUserFromToken = useCallback((tokenValue: string) => {
    const decoded = decodeToken(tokenValue);
    if (decoded) {
      // Normalizar id desde posibles campos del token
      const possibleSub: any = (decoded as any).sub;
      const normalizedId = decoded.id ?? (decoded as any).userId ?? (typeof possibleSub === 'string' ? Number(possibleSub) : possibleSub);
      const normalizedUser = { ...decoded, id: normalizedId } as DecodedToken;
      setUser(normalizedUser);
      setRole(normalizedUser.role || null);
    } else {
      setUser(null);
      setRole(null);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
        return;
      }

      if (isTokenExpired(token)) {
        console.error('Token has expired');
        logout();
        setLoading(false);
        return;
      }

      try {
        await validateToken(token);
        setIsAuthenticated(true);
        updateUserFromToken(token);
      } catch (error) {
        console.error('Token validation failed:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, logout, updateUserFromToken]);

  const login = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    updateUserFromToken(newToken);
  }, [updateUserFromToken]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}