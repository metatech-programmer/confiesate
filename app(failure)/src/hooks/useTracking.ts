import { useCallback } from 'react';
import { analytics } from '../utils/analytics';

interface TrackingEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

export const useTracking = () => {
  const trackEvent = useCallback(({
    category,
    action,
    label,
    value,
    metadata
  }: TrackingEvent) => {
    try {
      analytics.trackEvent({
        category,
        action,
        label,
        value,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          path: window.location.pathname,
          sessionId: sessionStorage.getItem('session_id')
        }
      });

      // Log to backend for persistencia
      fetch('/api/v1/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          action,
          label,
          value,
          metadata
        })
      }).catch(console.error);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, []);

  return { trackEvent };
};
