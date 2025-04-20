type EventType = 'like' | 'comment' | 'post' | 'report' | 'view';

interface TrackingEvent {
  type: EventType;
  userId?: string;
  targetId: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

class TrackingService {
  private queue: TrackingEvent[] = [];
  private readonly BATCH_SIZE = 10;
  private readonly FLUSH_INTERVAL = 30000; // 30 seconds

  constructor() {
    setInterval(() => this.flush(), this.FLUSH_INTERVAL);
    window.addEventListener('beforeunload', () => this.flush());
  }

  track(type: EventType, targetId: string, metadata?: Record<string, any>) {
    this.queue.push({
      type,
      targetId,
      metadata,
      timestamp: Date.now(),
    });

    if (this.queue.length >= this.BATCH_SIZE) {
      this.flush();
    }
  }

  private async flush() {
    if (this.queue.length === 0) return;

    try {
      const events = [...this.queue];
      this.queue = [];
      
      await fetch('/api/v1/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      console.error('Error flushing events:', error);
      // Requeue failed events
      this.queue = [...this.queue, ...events];
    }
  }
}

export const tracking = new TrackingService();
