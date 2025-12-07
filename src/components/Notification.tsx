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

  const baseStyles = "w-[320px] p-4 rounded-lg shadow-lg transition-all duration-300";
  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white"
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]}`}>
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
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {state.notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
}