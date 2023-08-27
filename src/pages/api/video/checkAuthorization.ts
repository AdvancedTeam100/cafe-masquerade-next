import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, adminFirestore } from '@/libs/firebase/admin';
import {
  VideoRequiredRole,
  checkUserPermission,
  getExpiresOfUnix,
} from '@/libs/models/video';
import { videoHost } from '@/libs/cloudStorage';
import { getSignedCookieString } from '@/libs/cloudStorage/getSignedCookie';
import { isProd } from '@/libs/utils/env';
import { AdminRole, isAdmin } from '@/libs/models/adminUser';
import { FirestoreVideo } from '@/libs/firebase/firestore/video';
import { VideoInfo } from '@/libs/models/videoCredential';

type ReqBody =
  | {
      userId?: string;
      videoId?: string;
      idToken?: string;
    }
  | {
      videoId?: string;
      publicAccess?: boolean;
    };

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const keyName = process.env.VIDEO_CDN_KEY_NAME || '';
  const secretKey = process.env.VIDEO_CDN_SECRET_KEY || '';

  const body = JSON.parse(req.body) as ReqBody;
  const { videoId } = body;

  if (!videoId) {
    res.status(404).end();
    return;
  }

  let video: FirestoreVideo | undefined;
  let videoInfo: VideoInfo | undefined;
  let userRole: VideoRequiredRole | AdminRole | 'nonUser' = 'nonUser';

  if ('userId' in body && 'idToken' in body) {
    const { userId, idToken } = body;
    if (!userId || !idToken) {
      console.log('userId or idToken do not exist.');
      res.status(404).end();
      return;
    }

    const [{ uid }, authUser, videoSnap, videoInfoSnap] = await Promise.all([
      await adminAuth.verifyIdToken(idToken),
      await adminAuth.getUser(userId),
      await adminFirestore.doc(`/videos/${videoId}`).get(),
      await adminFirestore
        .doc(`/videos/${videoId}/videoCredentials/info`)
        .get(),
    ]);

    if (uid !== userId) {
      console.log('userId is not equal to uid verified by idToken.');
      res.status(403).end();
      return;
    }
    video = videoSnap.data() as FirestoreVideo | undefined;
    videoInfo = videoInfoSnap.data() as VideoInfo | undefined;
    userRole = authUser.customClaims?.role || 'nonUser';
  } else if ('publicAccess' in body) {
    const [videoSnap, videoInfoSnap] = await Promise.all([
      await adminFirestore.doc(`/videos/${videoId}`).get(),
      await adminFirestore
        .doc(`/videos/${videoId}/videoCredentials/info`)
        .get(),
    ]);

    video = videoSnap.data() as FirestoreVideo | undefined;
    videoInfo = videoInfoSnap.data() as VideoInfo | undefined;
  } else {
    console.log('params is insufficient');
    res.status(404).end();
    return;
  }

  if (
    !video ||
    !videoInfo ||
    (video.status === 'Private' && !isAdmin(userRole)) ||
    (video.publishedAt.toDate() > new Date() && !isAdmin(userRole))
  ) {
    console.log(
      'video or videoInfo do not exist, or video permission is insufficient.',
    );
    res.status(404).end();
    return;
  }

  const { expiredAt } = video;
  if (!expiredAt || !checkUserPermission({ userRole, expiredAt })) {
    console.log('video is exipired to user, or user does not have permission.');
    res.status(403).end();
    return;
  }

  const srcUrl = videoInfo.url;

  const expiresOfUnix = getExpiresOfUnix({ userRole, expiredAt });
  const signedCookie = getSignedCookieString({
    urlPrefix: `${videoHost}/${videoId}`,
    keyName,
    secretKey,
    domain: isProd ? 'cafe-masquerade.com' : undefined,
    path: `/${videoId}`,
    expiresOfUnix,
    isSecure: true,
  });

  res.setHeader('Set-Cookie', signedCookie);
  res.status(200).json({ srcUrl });
};
export default handler;
