import { storage } from '@/libs/firebase';
import { castConverter, castDocument } from '@/libs/firebase/firestore/cast';
import {
  castImageCollection,
  castImageConverter,
  castImageDocument,
} from '@/libs/firebase/firestore/castImage';
import { ThunkAction } from '@/store';
import { Cast, CastStatus } from '@/libs/models/cast';
import { CastImage } from '@/libs/models/castImage';
import { castListActions } from '../castList';
import { actions } from './slice';
import { CastParams } from '.';

export const get = (castId: string): ThunkAction<Promise<void>> => async (
  dispatch,
) => {
  dispatch(actions.requestGet());
  try {
    const [castQuerySnap, castImageQuerySnap] = await Promise.all([
      await castDocument(castId).withConverter(castConverter).get(),
      await castImageCollection(castId).withConverter(castImageConverter).get(),
    ]);
    const cast = castQuerySnap.data();
    const castImages = castImageQuerySnap.docs.map((doc) => doc.data());
    if (cast) {
      dispatch(actions.successGet({ cast, castImages }));
    } else {
      dispatch(actions.failureGet());
    }
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};

export const create = (
  params: CastParams,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestCreate());
  try {
    const storageRef = storage.ref();
    const uploadTaskSnap = await storageRef
      .child(`cast/${params.id}/images/${new Date().getTime()}`)
      .put(params.image);
    const imageUrl: string = await uploadTaskSnap.ref.getDownloadURL();

    const cast: Cast = {
      id: params.id,
      name: params.name,
      description: params.description,
      selfIntroduction: params.selfIntroduction,
      physicalInformation: params.physicalInformation,
      imageUrl,
      status: params.status,
      tags: params.tags,
      youtubeChannelId: params.youtubeChannelId,
      youtubeChannelIdSecond: params.youtubeChannelIdSecond,
      socialId: params.socialId,
      notificationDiscordUrl: params.notificationDiscordUrl,
      qa: params.qa,
      joinedAt: params.joinedAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await castDocument(params.id).withConverter(castConverter).set(cast);
    await Promise.all(
      params.images.map(async (image, i) => {
        if (!('imageUrl' in image)) {
          const castImageId = `${i}_${cast.id}`;
          const storageRef = storage.ref();
          const uploadTaskSnap = await storageRef
            .child(
              `cast/${
                cast.id
              }/castImages/${castImageId}_${new Date().getTime()}`,
            )
            .put(image);
          const imageUrl: string = await uploadTaskSnap.ref.getDownloadURL();
          const castImage: CastImage = {
            id: castImageId,
            imageUrl,
          };
          await castImageDocument(cast.id, castImageId)
            .withConverter(castImageConverter)
            .set(castImage);
        }
      }),
    );
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
  castId: string,
  params: CastParams,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch, getState) => {
  dispatch(actions.requestUpdate());
  try {
    let imageUrl = params.imageUrl;
    if (params.image) {
      const storageRef = storage.ref();
      const uploadTaskSnap = await storageRef
        .child(`cast/${castId}/images/${new Date().getTime()}`)
        .put(params.image);
      imageUrl = await uploadTaskSnap.ref.getDownloadURL();
    }
    await castDocument(castId)
      .withConverter(castConverter)
      .update({
        name: params.name,
        description: params.description,
        livestreamingDescription: params.livestreamingDescription,
        selfIntroduction: params.selfIntroduction,
        physicalInformation: params.physicalInformation,
        imageUrl,
        status: params.status,
        tags: params.tags,
        youtubeChannelId: params.youtubeChannelId,
        youtubeChannelIdSecond: params.youtubeChannelIdSecond,
        socialId: params.socialId,
        notificationDiscordUrl: params.notificationDiscordUrl ?? '',
        qa: params.qa,
        joinedAt: new Date(params.joinedAt),
        updatedAt: new Date(),
      });
    if (params.images.length !== getState().adminCast.castImages.length) {
      const qs = await castImageCollection(castId).get();
      console.log(qs);
      await Promise.all(qs.docs.map(async (doc) => await doc.ref.delete()));
    }
    await Promise.all(
      params.images.map(async (image, i) => {
        const castImageId = `${i}_${castId}`;
        const castImage: CastImage = {
          id: castImageId,
          imageUrl: '',
        };
        if ('imageUrl' in image) {
          castImage.imageUrl = image.imageUrl;
        } else {
          const storageRef = storage.ref();
          const uploadTaskSnap = await storageRef
            .child(
              `cast/${castId}/castImages/${castImageId}_${new Date().getTime()}`,
            )
            .put(image);
          const imageUrl: string = await uploadTaskSnap.ref.getDownloadURL();
          castImage.imageUrl = imageUrl;
        }
        await castImageDocument(castId, castImageId)
          .withConverter(castImageConverter)
          .set(castImage);
      }),
    );
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
  castId: string,
  status: CastStatus,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());
  dispatch(castListActions.setLoadingCastId({ castId }));
  try {
    await castDocument(castId).withConverter(castConverter).update({
      status,
      updatedAt: new Date(),
    });
    dispatch(actions.successUpdate());
    dispatch(castListActions.updateCastItemStatus({ castId, status }));
    dispatch(castListActions.setLoadingCastId({ castId: '' }));
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdate());
    dispatch(castListActions.setLoadingCastId({ castId: '' }));
    failureCallback(e?.message ?? '');
    return;
  }
};

export const deleteCast = (
  castId: string,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestDelete());
  dispatch(castListActions.setLoadingCastId({ castId }));
  try {
    await castDocument(castId).delete();
    const castImageQs = await castImageCollection(castId).get();
    await Promise.all(
      castImageQs.docs.map(async (doc) => {
        await doc.ref.delete();
      }),
    );
    dispatch(actions.successDelete());
    dispatch(castListActions.removeCastItem({ castId }));
    dispatch(castListActions.setLoadingCastId({ castId: '' }));
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureDelete());
    dispatch(castListActions.setLoadingCastId({ castId: '' }));
    failureCallback(e?.message ?? '');
    return;
  }
};
