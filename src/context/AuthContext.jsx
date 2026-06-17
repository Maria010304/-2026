import { createContext, useContext, useEffect, useState } from 'react';
import { USERS, getPermissions } from '../data/users';

const AuthContext = createContext(null);
const STORAGE_KEY = 'ifbest-user';

export function AuthProvider({ children }) {
  // Сессия восстанавливается из localStorage, чтобы перезагрузка не сбрасывала вход.
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); }
    catch { return null; }
  });

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  /**
   * Проверка логина/пароля по списку мок-пользователей.
   * Возвращает Promise, чтобы UI мог показать состояние загрузки.
   */
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Имитация сетевой задержки — даёт возможность показать loading state
      setTimeout(() => {
        const found = USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (found) {
          // Не храним пароль в сессии
          const { password: _, ...safe } = found;
          setUser(safe);
          resolve(safe);
        } else {
          reject(new Error('Неверный email или пароль'));
        }
      }, 400);
    });
  };

  const logout = () => setUser(null);

  const permissions = user ? getPermissions(user.role) : null;

  return (
    <AuthContext.Provider value={{ user, login, logout, permissions, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
