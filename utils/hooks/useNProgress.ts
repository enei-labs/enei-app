import { useEffect } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';

interface UseNProgressOptions {
  minimum?: number;
  easing?: string;
  speed?: number;
  showSpinner?: boolean;
  trickleSpeed?: number;
  onStart?: (url: string) => void;
  onComplete?: () => void;
  onError?: () => void;
}

export const useNProgress = (options: UseNProgressOptions = {}) => {
  useEffect(() => {
    // Configure NProgress with custom options
    NProgress.configure({
      minimum: options.minimum ?? 0.3,
      easing: options.easing ?? 'ease',
      speed: options.speed ?? 800,
      showSpinner: options.showSpinner ?? false,
      trickleSpeed: options.trickleSpeed ?? 200,
    });

    const handleStart = (url: string) => {
      // 避免在相同頁面內錨點跳轉時顯示進度條
      if (url === Router.asPath) return;
      
      if (options.onStart) {
        options.onStart(url);
      }
      NProgress.start();
    };

    const handleComplete = () => {
      NProgress.done();
      if (options.onComplete) {
        options.onComplete();
      }
    };

    const handleError = () => {
      NProgress.done();
      if (options.onError) {
        options.onError();
      }
    };

    Router.events.on('routeChangeStart', handleStart);
    Router.events.on('routeChangeComplete', handleComplete);
    Router.events.on('routeChangeError', handleError);

    // Cleanup function
    return () => {
      Router.events.off('routeChangeStart', handleStart);
      Router.events.off('routeChangeComplete', handleComplete);
      Router.events.off('routeChangeError', handleError);
    };
  }, [options]);

  // Return methods for manual control
  return {
    start: () => NProgress.start(),
    done: () => NProgress.done(),
    set: (n: number) => NProgress.set(n),
    inc: (amount?: number) => NProgress.inc(amount),
    remove: () => NProgress.remove(),
  };
}; 