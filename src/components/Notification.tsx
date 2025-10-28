import { useEffect } from 'react';
import { useApi } from '../context/ApiContext';

interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: (id: string) => void;
}

export function Notification({ type, message, id, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const baseStyles = "fixed right-4 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0";
  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white"
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]}`} style={{ top: '1rem' }}>
      <div className="flex items-center justify-between">
        <p className="mr-8">{message}</p>
        <button
          onClick={() => onClose(id)}
          className="text-white hover:text-gray-200 focus:outline-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function NotificationContainer() {
  const { state, removeNotification } = useApi();

  return (
    <div className="fixed top-0 right-0 z-50">
      {state.notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{ top: `${index * 4 + 1}rem` }}
          className="transition-all duration-300"
        >
          <Notification
            {...notification}
            onClose={removeNotification}
          />
        </div>
      ))}
    </div>
  );
}