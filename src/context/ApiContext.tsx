import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ApiState {
  loading: boolean;
  error: string | null;
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ApiContextType {
  state: ApiState;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: string | null) => void;
  addNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ApiState>({
    loading: false,
    error: null,
    notifications: [],
  });

  const startLoading = () => {
    setState(prev => ({ ...prev, loading: true }));
  };

  const stopLoading = () => {
    setState(prev => ({ ...prev, loading: false }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, { id, type, message }],
    }));

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  };

  const clearNotifications = () => {
    setState(prev => ({ ...prev, notifications: [] }));
  };

  return (
    <ApiContext.Provider
      value={{
        state,
        startLoading,
        stopLoading,
        setError,
        addNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}