interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp?: number;
}

interface UserFeedback {
  type: 'bug' | 'feature' | 'feedback';
  content: string;
  rating?: number;
  metadata?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private static instance: Analytics;
  private events: AnalyticsEvent[] = [];
  private feedback: UserFeedback[] = [];
  private readonly MAX_EVENTS = 1000;
  private readonly MAX_FEEDBACK = 500;

  private constructor() {
    this.setupPerformanceTracking();
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  private setupPerformanceTracking() {
    if ('PerformanceObserver' in window) {
      // Track page load performance
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackEvent({
            category: 'Performance',
            action: 'PageLoad',
            label: entry.name,
            value: Math.round(entry.duration),
            metadata: {
              type: entry.entryType,
              startTime: entry.startTime,
            },
          });
        }
      }).observe({ entryTypes: ['navigation'] });

      // Track user interactions
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackEvent({
            category: 'Performance',
            action: 'Interaction',
            label: entry.name,
            value: Math.round(entry.duration),
            metadata: {
              type: entry.entryType,
              target: (entry as any).target?.tagName,
            },
          });
        }
      }).observe({ entryTypes: ['event'] });
    }
  }

  trackEvent(event: AnalyticsEvent) {
    const enrichedEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.events.unshift(enrichedEvent);

    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(0, this.MAX_EVENTS);
    }

    this.sendToServer('events', enrichedEvent);
  }

  trackFeedback(feedback: UserFeedback) {
    const enrichedFeedback = {
      ...feedback,
      timestamp: Date.now(),
    };

    this.feedback.unshift(enrichedFeedback);

    if (this.feedback.length > this.MAX_FEEDBACK) {
      this.feedback = this.feedback.slice(0, this.MAX_FEEDBACK);
    }

    this.sendToServer('feedback', enrichedFeedback);
  }

  private async sendToServer(type: 'events' | 'feedback', data: any) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/analytics/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(`Failed to send ${type} to server`);
      }
    } catch (e) {
      console.error(`Error sending ${type} to server:`, e);
    }
  }

  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  getFeedback(): UserFeedback[] {
    return this.feedback;
  }

  clearEvents() {
    this.events = [];
  }

  clearFeedback() {
    this.feedback = [];
  }
}

export const analytics = Analytics.getInstance();