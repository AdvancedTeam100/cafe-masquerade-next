import { useEffect, useState } from 'react';

export const useEnableTouchScreen = () => {
  const [isEnableTouchScreen, setIsEnableTouchScreen] = useState(false);

  useEffect(() => {
    setIsEnableTouchScreen(
      navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer:coarse)').matches ||
        'orientation' in window,
    );
  }, []);

  return {
    isEnableTouchScreen,
  };
};
