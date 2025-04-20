import { useEffect, useRef, useCallback } from 'react';
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { toast } from 'react-hot-toast';

interface UseWebSocketOptions {
  url: string;
  onMessage?: (data: any) => void;
  onLike?: (data: any) => void;
  onComment?: (data: any) => void;
  onReport?: (data: any) => void;
}

export const useWebSocket = ({
  url,
  onMessage,
  onLike,
  onComment,
  onReport
}: UseWebSocketOptions) => {
  const connection = useRef<HubConnection | null>(null);
  const { token } = useSelector((state: RootState) => state.auth);
  const reconnectAttempts = useRef(0);
  const MAX_RETRIES = 5;

  const connect = useCallback(async () => {
    try {
      connection.current = new HubConnectionBuilder()
        .withUrl(url, { accessTokenFactory: () => token || '' })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
            const delayMs = Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
            return delayMs + Math.random() * 1000;
          }
        })
        .configureLogging(LogLevel.Warning)
        .build();

      await connection.current.start();
      console.log('WebSocket connected');
      reconnectAttempts.current = 0;

      // Register event handlers
      connection.current.on('ReceiveMessage', onMessage || (() => {}));
      connection.current.on('ReceiveLike', onLike || (() => {}));
      connection.current.on('ReceiveComment', onComment || (() => {}));
      connection.current.on('ReceiveReport', onReport || (() => {}));

    } catch (error) {
      console.error('WebSocket connection failed:', error);
      reconnectAttempts.current++;
      
      if (reconnectAttempts.current < MAX_RETRIES) {
        setTimeout(connect, 5000);
      } else {
        toast.error('Error de conexión. Por favor, recarga la página.');
      }
    }
  }, [url, token, onMessage, onLike, onComment, onReport]);

  useEffect(() => {
    if (token) {
      connect();
    }

    return () => {
      if (connection.current) {
        connection.current.stop();
      }
    };
  }, [connect, token]);

  return connection.current;
};