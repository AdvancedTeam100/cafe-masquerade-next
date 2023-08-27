import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  CheckAuthorizationBody,
  checkVideoAuthorization,
} from '@/libs/apiClient/video/checkAuthorization';
import { authSelectors } from '@/store/auth';

export const useVideoAuthorization = (videoId: string | null) => {
  const { user, isInitialized, idToken } = useSelector(authSelectors.state);
  const [isChecking, setIsChecking] = useState(false);
  const [srcUrl, setSrcUrl] = useState('');

  useEffect(() => {
    if (!isInitialized || !videoId) return;

    const body: CheckAuthorizationBody =
      user && idToken
        ? { videoId, idToken, userId: user.uid }
        : { videoId, publicAccess: true };
    (async () => {
      setIsChecking(true);
      const { srcUrl } = await checkVideoAuthorization(body);
      setSrcUrl(srcUrl);
      setIsChecking(false);
    })();
  }, [idToken, isInitialized, user, videoId]);

  return {
    srcUrl,
    isChecking,
  };
};
