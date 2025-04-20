interface ErrorEvent {
  message: string;
  stack?: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

const MAX_STORED_ERRORS = 50;
const STORAGE_KEY = 'app_errors';

export function logError(error: Error): void {
  const errorEvent: ErrorEvent = {
    message: error.message,
    stack: error.stack,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent
  };

  // Get existing errors
  const storedErrors = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  
  // Add new error and limit array size
  storedErrors.unshift(errorEvent);
  if (storedErrors.length > MAX_STORED_ERRORS) {
    storedErrors.length = MAX_STORED_ERRORS;
  }

  // Save back to storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storedErrors));

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorEvent);
  }
}

export function initErrorTracking(): void {
  window.onerror = (message, source, lineno, colno, error) => {
    if (error instanceof Error) {
      logError(error);
    } else {
      logError(new Error(String(message)));
    }
  };
}

export function clearErrorLog(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getErrorLog(): ErrorEvent[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}