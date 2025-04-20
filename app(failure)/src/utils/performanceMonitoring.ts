interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 100;

  private constructor() {
    // Inicializar observador de performance
    if ('PerformanceObserver' in window) {
      // Observar métricas de LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.logMetric({
          name: 'LCP',
          value: lastEntry.startTime,
          timestamp: Date.now(),
          metadata: {
            element: (lastEntry as any).element?.tagName,
          },
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Observar métricas de FID (First Input Delay)
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.logMetric({
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            timestamp: Date.now(),
            metadata: {
              type: entry.name,
            },
          });
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Observar métricas de CLS (Cumulative Layout Shift)
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.logMetric({
          name: 'CLS',
          value: clsValue,
          timestamp: Date.now(),
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Observar métricas de navegación
      const navigationObserver = new PerformanceObserver((entryList) => {
        const navigationEntry = entryList.getEntries()[0];
        this.logMetric({
          name: 'Navigation',
          value: navigationEntry.duration,
          timestamp: Date.now(),
          metadata: {
            type: navigationEntry.initiatorType,
            url: (navigationEntry as any).name,
          },
        });
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });
    }
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  logMetric(metric: PerformanceMetric) {
    this.metrics.unshift(metric);

    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(0, this.MAX_METRICS);
    }

    this.sendMetricToServer(metric);

    if (import.meta.env.DEV) {
      console.log('Performance metric:', metric);
    }
  }

  private async sendMetricToServer(metric: PerformanceMetric) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });

      if (!response.ok) {
        console.error('Failed to send metric to server');
      }
    } catch (e) {
      console.error('Error sending metric to server:', e);
    }
  }

  getMetrics() {
    return this.metrics;
  }

  clearMetrics() {
    this.metrics = [];
  }

  // Método para medir el tiempo de ejecución de una función
  measureExecutionTime(fn: Function, name: string) {
    return async (...args: any[]) => {
      const start = performance.now();
      try {
        const result = await fn(...args);
        const duration = performance.now() - start;
        
        this.logMetric({
          name: `execution_time_${name}`,
          value: duration,
          timestamp: Date.now(),
          metadata: {
            args: args.map(arg => typeof arg).join(','),
          },
        });
        
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        this.logMetric({
          name: `execution_time_${name}_error`,
          value: duration,
          timestamp: Date.now(),
          metadata: {
            error: error.message,
          },
        });
        throw error;
      }
    };
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();