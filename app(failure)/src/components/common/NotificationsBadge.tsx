import React from 'react';
import { useNotifications } from '../../context/NotificationsContext';

interface NotificationsBadgeProps {
  className?: string;
}

export const NotificationsBadge: React.FC<NotificationsBadgeProps> = ({ className = '' }) => {
  const { state } = useNotifications();
  const { unreadCount } = state;

  if (unreadCount === 0) return null;

  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full ${className}`}>
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  );
};