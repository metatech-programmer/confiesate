import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface PushNotificationContextValue {
  isSupported: boolean;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

const PushNotificationContext = createContext<PushNotificationContextValue | null>(null);

export const PushNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    const checkSupport = async () => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSupported(true);
        setIsSubscribed(!!subscription);
        setSubscription(subscription);
      }
    };

    checkSupport();
  }, []);

  const subscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY
      });

      await fetch('/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription })
      });

      setIsSubscribed(true);
      setSubscription(subscription);
      toast.success('Notificaciones activadas');
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast.error('Error al activar notificaciones');
    }
  };

  const unsubscribe = async () => {
    if (subscription) {
      try {
        await subscription.unsubscribe();
        await fetch('/api/v1/notifications/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription })
        });

        setIsSubscribed(false);
        setSubscription(null);
        toast.success('Notificaciones desactivadas');
      } catch (error) {
        console.error('Error unsubscribing from push notifications:', error);
        toast.error('Error al desactivar notificaciones');
      }
    }
  };

  return (
    <PushNotificationContext.Provider
      value={{ isSupported, isSubscribed, subscription, subscribe, unsubscribe }}
    >
      {children}
    </PushNotificationContext.Provider>
  );
};

export const usePushNotifications = () => {
  const context = useContext(PushNotificationContext);
  if (!context) {
    throw new Error('usePushNotifications must be used within a PushNotificationProvider');
  }
  return context;
};
