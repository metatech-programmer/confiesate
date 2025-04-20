import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface WebSocketContextType {
  connection: HubConnection | null;
  isConnected: boolean;
  isEnabled: boolean;
  sendMessage: (method: string, ...args: any[]) => Promise<void>;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isEnabled = import.meta.env.VITE_WEBSOCKET_ENABLED === 'true';
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const { token } = useSelector((state: RootState) => state.auth);

  const setupConnection = async () => {
    if (!isEnabled) {
      console.log('WebSocket está deshabilitado por configuración');
      return;
    }

    try {
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_API_URL}/hubs/notifications`, {
          accessTokenFactory: () => token || ''
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
            const delays = [0, 2000, 10000, 30000];
            return delays[retryContext.previousRetryCount] || 60000;
          }
        })
        .configureLogging(LogLevel.Warning)
        .build();

      newConnection.onclose(() => {
        setIsConnected(false);
        toast.error('Conexión perdida. Intentando reconectar...');
      });

      newConnection.onreconnecting(() => {
        setIsConnected(false);
        reconnectAttempts.current++;
        if (reconnectAttempts.current === 1) {
          toast.loading('Reconectando...');
        }
      });

      newConnection.onreconnected(() => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        toast.success('Conexión restablecida');
      });

      await newConnection.start();
      setConnection(newConnection);
      setIsConnected(true);

    } catch (error) {
      if (isEnabled) {
        console.error('WebSocket connection error:', error);
        toast.error('Error de conexión. Reintentando...');
        setTimeout(setupConnection, 5000);
      }
    }
  };

  useEffect(() => {
    if (token && isEnabled) {
      setupConnection();
    }

    return () => {
      if (isEnabled) {
        connection?.stop();
      }
    };
  }, [token, isEnabled]);

  const sendMessage = async (method: string, ...args: any[]) => {
    if (!isEnabled) {
      console.warn('WebSocket está deshabilitado');
      return;
    }
    if (!connection || !isConnected) {
      throw new Error('No hay conexión disponible');
    }
    try {
      await connection.invoke(method, ...args);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return (
    <WebSocketContext.Provider value={{ connection, isConnected, isEnabled, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};
