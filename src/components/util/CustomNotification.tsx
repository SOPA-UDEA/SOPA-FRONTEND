import { useEffect } from 'react';
import toast from 'react-hot-toast';

type CustomNotificationProps = {
  message: string;
  type: 'success' | 'error';
  show: boolean;
};

export const CustomNotification = ({ message, type, show }: CustomNotificationProps) => {
  useEffect(() => {
    if (show) {
      if (type === 'success') toast.success(message);
      if (type === 'error') toast.error(message);
    }
  }, [show, message, type]);

  return null; 
};