import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const usePageRemovingAlert = ({
  showAlert,
  message = '変更を破棄しますか？',
  hasIncludeSubmitting = true,
}: {
  showAlert: boolean;
  message?: string;
  hasIncludeSubmitting?: boolean;
}) => {
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hasIncludeSubmitting) {
      window.addEventListener('submit', () => {
        setIsSubmitting(true);
      });
    }

    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      (e || window.event).returnValue = message;
      return message;
    };
    const beforeRouteHandler = (url: string) => {
      if (router.pathname !== url && !confirm(message)) {
        router.events.emit('routeChangeError');
        throw message;
      }
      setIsSubmitting(false);
    };
    if (showAlert && !isSubmitting) {
      window.addEventListener('beforeunload', beforeUnloadHandler);
      router.events.on('routeChangeStart', beforeRouteHandler);
      setIsRegistered(true);
    } else {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      router.events.off('routeChangeStart', beforeRouteHandler);
    }
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      router.events.off('routeChangeStart', beforeRouteHandler);
    };
  }, [
    showAlert,
    message,
    isRegistered,
    isSubmitting,
    hasIncludeSubmitting,
    router,
  ]);

  return {
    isRegistered,
  };
};
