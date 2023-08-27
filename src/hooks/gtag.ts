import { useEffect } from 'react';
import { useRouter } from 'next/router';

import * as gtag from '@/libs/gtag';

export const usePageView = (): void => {
  const router = useRouter();
  useEffect(() => {
    if (typeof gtag.GA_TRACKING_ID === 'undefined') {
      return;
    }
    if (router.isPreview) {
      return;
    }
    const handleRouteChange = (path: URL) => {
      gtag.pageview(path);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, router.isPreview]);
};
