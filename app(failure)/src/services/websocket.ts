import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { toast } from 'react-hot-toast';
import { store } from '../store';
import { updatePost, addNotification } from '../features/posts/postsSlice';

class WebSocketService {
  private connection: signalR.HubConnection | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async connect(token: string) {
    if (this.connection) return;

    try {
      const wsUrl = import.meta.env.VITE_API_URL?.replace('http', 'ws') || 'ws://localhost:3000';
      
      this.connection = new HubConnectionBuilder()
        .withUrl(wsUrl + '/hubs/notifications', {
          accessTokenFactory: () => token,
          withCredentials: true, // Enable CORS credentials
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: this.getRetryDelay.bind(this),
        })
        .configureLogging(import.meta.env.PROD ? LogLevel.Error : LogLevel.Information)
        .build();

      // Configurar manejadores de eventos
      this.setupEventHandlers();

      await this.connection.start();
      console.log('WebSocket connected successfully');
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleConnectionError(error);
    }
  }

  private setupEventHandlers() {
    if (!this.connection) return;

    this.connection.on('PostUpdated', (post) => {
      store.dispatch(updatePost(post));
    });

    this.connection.on('NewNotification', (notification) => {
      store.dispatch(addNotification(notification));
      toast(notification.message);
    });
  }

  private getRetryDelay(retryContext: { previousRetryCount: number }) {
    // Implementar backoff exponencial con jitter
    const baseDelay = 1000;
    const maxDelay = 30000;
    const exponential = Math.min(
      baseDelay * Math.pow(2, retryContext.previousRetryCount),
      maxDelay
    );
    return exponential + Math.random() * 1000;
  }

  private handleConnectionError(error: any) {
    this.reconnectAttempts++;
    const errorMessage = error?.message || 'Error de conexión desconocido';
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      toast.error(`Error de conexión: ${errorMessage}. Por favor, recarga la página.`);
    } else {
      toast.error(`Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    }
  }

  disconnect() {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
  }
}

export const webSocketService = new WebSocketService();