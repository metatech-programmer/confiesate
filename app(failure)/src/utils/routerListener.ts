import { analytics } from './analytics';

export const initRouterListener = () => {
  // Track initial page view
  analytics.trackEvent({
    category: 'Navigation',
    action: 'PageView',
    label: window.location.pathname,
  });

  const handleRouteChange = () => {
    analytics.trackEvent({
      category: 'Navigation',
      action: 'PageView',
      label: window.location.pathname,
    });
  };

  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason);
    analytics.trackEvent({
      category: 'Error',
      action: 'UnhandledRejection',
      label: event.reason?.message || 'Unknown error',
    });
  };

  window.addEventListener('popstate', handleRouteChange);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  return () => {
    window.removeEventListener('popstate', handleRouteChange);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  };
};
