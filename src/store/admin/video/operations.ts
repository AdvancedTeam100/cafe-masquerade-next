import { videoConverter, videoDocument } from '@/libs/firebase/firestore/video';
import {
  videoCredentialDocument,
  videoInfoConverter,
} from '@/libs/firebase/firestore/videoCredential';
import { ThunkAction } from '@/store';
import { getAllowedRoles } from '@/libs/models/video';
import firestore from '@/libs/firebase/firestore';
import { checkVideoAuthorization } from '@/libs/apiClient/video/checkAuthorization';
import { actions } from './slice';
import { VideoParams } from '.';

export const get = (videoId: string): ThunkAction<Promise<void>> => async (
  dispatch,
) => {
  dispatch(actions.requestGet());
  try {
    const [videoQuerySnap, videoInfoQuerySnap] = await Promise.all([
      await videoDocument(videoId).withConverter(videoConverter).get(),
      await videoCredentialDocument(videoId, 'info')
        .withConverter(videoInfoConverter)
        .get(),
    ]);
    const video = videoQuerySnap.data();
    const videoInfo = videoInfoQuerySnap.data() ?? null;
    if (video) {
      dispatch(actions.successGet({ video, videoInfo }));
    }
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};

export const create = (
  videoId: string,
  params: VideoParams,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestCreate());
  try {
    await Promise.all([
      (async () => {
        const docSnap = await videoDocument(videoId).get();
        if (docSnap.exists) {
          await videoDocument(videoId).update({
            ...params,
            publishedAt: new Date(params.publishedAt),
            updatedAt: new Date(),
          });
        } else {
          await videoDocument(videoId)
            .withConverter(videoConverter)
            .set({
              id: videoId,
              ...params,
              wasLivestreaming: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
        }
      })(),
      (async () => {
        const docSnap = await videoCredentialDocument(videoId, 'info').get();
        if (docSnap.exists) {
          await videoCredentialDocument(videoId, 'info').update({
            allowedRoles: getAllowedRoles(params.requiredRole),
          });
        } else {
          await videoCredentialDocument(videoId, 'info')
            .withConverter(videoInfoConverter)
            .set({
              url: '',
              allowedRoles: getAllowedRoles(params.requiredRole),
            });
        }
      })(),
    ]);
    dispatch(actions.successCreate());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureCreate());
    failureCallback(e?.message ?? '');
    return;
  }
};

export const update = (
  videoId: string,
  params: VideoParams,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());
  try {
    await Promise.all([
      await videoDocument(videoId).update({
        ...params,
        publishedAt: new Date(params.publishedAt),
        updatedAt: new Date(),
      }),
      (async () => {
        const docSnap = await videoCredentialDocument(videoId, 'info').get();
        if (docSnap.exists) {
          await videoCredentialDocument(videoId, 'info').update({
            allowedRoles: getAllowedRoles(params.requiredRole),
          });
        } else {
          await videoCredentialDocument(videoId, 'info')
            .withConverter(videoInfoConverter)
            .set({
              url: '',
              allowedRoles: getAllowedRoles(params.requiredRole),
            });
        }
      })(),
    ]);
    dispatch(actions.successUpdate());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdate());
    failureCallback(e?.message ?? '');
    return;
  }
};

export const deleteVideo = (
  videoId: string,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestDelete());
  try {
    await firestore.runTransaction(async (transaction) => {
      const t = transaction.delete(videoDocument(videoId));
      t.delete(videoCredentialDocument(videoId, 'info'));
    });
    dispatch(actions.successDelete());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureDelete());
    failureCallback(e?.message ?? '');
    return;
  }
};

export const checkEnableToPlay = (
  videoId: string,
): ThunkAction<Promise<void>> => async (dispatch, getState) => {
  const { user, idToken } = getState().auth;
  if (!user || !idToken) return;
  try {
    await checkVideoAuthorization({
      videoId,
      userId: user.uid,
      idToken,
    });
    dispatch(actions.setIsEnableToPlay({ isEnableToPlay: true }));
  } catch (e) {
    console.log(e);
  }
};
