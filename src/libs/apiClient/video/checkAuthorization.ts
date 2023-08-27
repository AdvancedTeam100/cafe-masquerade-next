import { fetchApi } from '..';

export type CheckAuthorizationBody =
  | {
      videoId: string;
      userId: string;
      idToken: string;
    }
  | {
      videoId: string;
      publicAccess: true;
    };

type CheckAuthorizationResponse = {
  srcUrl: string;
};

export const checkVideoAuthorization = async (
  body: CheckAuthorizationBody,
): Promise<CheckAuthorizationResponse> => {
  return await fetchApi<CheckAuthorizationResponse>(
    fetch('/api/video/checkAuthorization', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(body),
    }),
  );
};
