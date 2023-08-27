import { storage } from '@/libs/firebase';
import {
  livestreamingCollection,
  livestreamingConverter,
  livestreamingDocument,
} from '@/libs/firebase/firestore/livestreaming';
import { ThunkAction } from '@/store';
import {
  Livestreaming,
  LivestreamingStatus,
} from '@/libs/models/livestreaming';
import {
  livestreamingCredentialDocument,
  livestreamingInfoConverter,
  livestreamingPasswordConverter,
} from '@/libs/firebase/firestore/livestreamingCredential';
import {
  LivestreamingPassword,
  getEncodedUrl,
} from '@/libs/models/livestreamingCredential';
import { LivestreamingSlot } from '@/libs/models/livestreamingSlot';
import { callSafety } from '@/libs/firebase/functions/callSafety';
import { castCollection, castConverter } from '@/libs/firebase/firestore/cast';
import { livestreamingListOperations } from '../livestreamingList';
import { actions } from './slice';
import {
  LivestreamingCreateParams,
  LivestreamingUpdateParams,
  UpdateVideoConfigParams,
} from '.';

export const get = (
  livestreamingId: string,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestGet());
  try {
    const [
      livestreamingQs,
      livestreamingPasswordQs,
      livestreamingInfoQs,
    ] = await Promise.all([
      await livestreamingDocument(livestreamingId)
        .withConverter(livestreamingConverter)
        .get(),
      await livestreamingCredentialDocument(livestreamingId, 'password')
        .withConverter(livestreamingPasswordConverter)
        .get(),
      await livestreamingCredentialDocument(livestreamingId, 'info')
        .withConverter(livestreamingInfoConverter)
        .get(),
    ]);
    const livestreaming = livestreamingQs.data();
    const livestreamingPassword = livestreamingPasswordQs.data();
    const livestreamingInfo = livestreamingInfoQs.data();
    if (livestreaming && livestreamingPassword) {
      dispatch(
        actions.successGet({
          livestreaming,
          livestreamingPassword,
          livestreamingInfo: livestreamingInfo ?? null,
        }),
      );
    } else {
      dispatch(actions.failureGet());
    }
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};

export const create = (
  params: LivestreamingCreateParams,
  successCallback: (livestreamingId: string) => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestCreate());
  try {
    const qs = await livestreamingCollection()
      .where('password', '==', params.password)
      .get();
    if (qs.size > 0) {
      throw new Error(
        'このパスワードは過去に使用されています。新しいパスワードを入力してください',
      );
    }
    const docRef = livestreamingCollection().doc();
    const storageRef = storage.ref();
    const uploadTaskSnap = await storageRef
      .child(`livestreaming/${docRef.id}/thumbnails/${new Date().getTime()}`)
      .put(params.thumbnail);

    const thumbnailUrl: string = await uploadTaskSnap.ref.getDownloadURL();

    let description = params.description;
    if (params.castId) {
      const cast = await (await castCollection().doc(params.castId).get()).ref
        .withConverter(castConverter)
        .get();
      const defaultDescription = cast.data()?.livestreamingDescription;
      description = defaultDescription || '';
    }

    const livestreaming: Livestreaming = {
      id: docRef.id,
      title: params.title,
      description,
      thumbnailUrl,
      status: LivestreamingStatus.Scheduled,
      requiredRole: params.requiredRole,
      shouldStartRecording: true,
      castId: params.castId,
      publishedAt: params.publishedAt,
      videoConfig: params.videoConfig,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await docRef.withConverter(livestreamingConverter).set(livestreaming);
    const password: LivestreamingPassword = {
      password: params.password,
      rawPassword: params.rawPassword,
    };
    await livestreamingCredentialDocument(livestreaming.id, 'password')
      .withConverter(livestreamingPasswordConverter)
      .set(password);
    dispatch(actions.successCreate());
    successCallback(livestreaming.id);
  } catch (e) {
    console.log(e);
    dispatch(actions.failureCreate());
    failureCallback(e?.message ?? '');
    return;
  }
};

export const update = (
  livestreamingId: string,
  params: LivestreamingUpdateParams,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());
  try {
    const qs = await livestreamingCollection()
      .where('password', '==', params.password)
      .get();
    if (qs.size > 0 && qs.docs[0]?.id !== livestreamingId) {
      throw new Error(
        'このパスワードは過去に使用されています。新しいパスワードを入力してください',
      );
    }

    let thumbnailUrl = params.thumbnailUrl;
    if (params.thumbnail) {
      const storageRef = storage.ref();
      const uploadTaskSnap = await storageRef
        .child(
          `livestreaming/${livestreamingId}/thumbnails/${new Date().getTime()}`,
        )
        .put(params.thumbnail);
      thumbnailUrl = await uploadTaskSnap.ref.getDownloadURL();
    }
    await livestreamingDocument(livestreamingId)
      .withConverter(livestreamingConverter)
      .update({
        title: params.title,
        description: params.description,
        publishedAt: new Date(params.publishedAt),
        requiredRole: params.requiredRole,
        thumbnailUrl,
        updatedAt: new Date(),
      });
    await livestreamingCredentialDocument(livestreamingId, 'password')
      .withConverter(livestreamingPasswordConverter)
      .set({
        password: params.password,
        rawPassword: params.rawPassword,
      });
    dispatch(actions.successUpdate());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdate());
    failureCallback(e?.message ?? '');
    return;
  }
};

export const updateLivestreamingInfo = (
  livestreaming: Livestreaming,
  livestreamingSlot: LivestreamingSlot,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());
  try {
    const encodedUrl = getEncodedUrl({
      playbackUrl: livestreamingSlot.playbackUrl.hls,
      publishedAt: livestreaming.publishedAt,
      sharedSecret: livestreamingSlot.sharedSecret,
    });

    await livestreamingCredentialDocument(livestreaming.id, 'info')
      .withConverter(livestreamingInfoConverter)
      .set({
        slotName: livestreamingSlot.name,
        encodedUrl,
      });
    dispatch(actions.successUpdate());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdate());
    failureCallback(e?.message ?? '');
    return;
  }
};

export const updateStatus = (
  livestreamingId: string,
  status: LivestreamingStatus,
  slotId: string,
  shouldStartRecording: boolean,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());

  if (shouldStartRecording) {
    const arg = {
      livestreamingId,
      slotId,
    };
    try {
      switch (status) {
        case LivestreamingStatus.Streaming:
          await callSafety({
            funcName: 'startRecordingLive',
            arg,
          });
          break;
        case LivestreamingStatus.Finished:
          await callSafety({
            funcName: 'stopRecordingLive',
            arg,
          });
      }
    } catch (e) {
      console.log(e);

      if (status === LivestreamingStatus.Streaming) {
        failureCallback('ライブ配信の録画開始に失敗しました');
      } else {
        failureCallback('ライブ配信の録画停止に失敗しました');
      }
    }
  }

  if (status === 'Streaming') {
    try {
      await callSafety({
        funcName: 'noticeStartingLive',
        arg: {
          livestreamingId,
          origin: location.origin,
        },
      });
    } catch (e) {
      console.log(e);
      failureCallback('Discordへの通知に失敗しました');
    }
  }

  try {
    if (status === 'Finished') {
      await livestreamingDocument(livestreamingId)
        .withConverter(livestreamingConverter)
        .update({
          status,
          updatedAt: new Date(),
          finishedAt: new Date(),
        });
      dispatch(actions.successUpdate());
      successCallback();
    } else {
      await livestreamingDocument(livestreamingId)
        .withConverter(livestreamingConverter)
        .update({
          status,
          updatedAt: new Date(),
        });
      dispatch(actions.successUpdate());
      successCallback();
    }
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdate());
    failureCallback(e?.message ?? 'ライブ配信の更新に失敗しました');
    return;
  }
};

export const updateCastId = (
  livestreamingId: string,
  castId: string,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());
  try {
    await livestreamingDocument(livestreamingId)
      .withConverter(livestreamingConverter)
      .update({
        castId,
        updatedAt: new Date(),
      });
    dispatch(actions.successUpdate());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdate());
    failureCallback(e?.message ?? '');
    return;
  }
};

export const updateVideoConfig = (
  livestreamingId: string,
  params: UpdateVideoConfigParams,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());
  try {
    await livestreamingDocument(livestreamingId)
      .withConverter(livestreamingConverter)
      .update({
        ...params,
        updatedAt: new Date(),
      });
    dispatch(actions.successUpdate());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdate());
    failureCallback(e?.message ?? '');
    return;
  }
};

export const deleteLivestreaming = (
  livestreamingId: string,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestDelete());
  try {
    await livestreamingDocument(livestreamingId).delete();
    successCallback();
    dispatch(actions.successDelete());
    dispatch(livestreamingListOperations.get());
  } catch (e) {
    failureCallback(e?.message ?? '');
    dispatch(actions.failureDelete());
    return;
  }
};
