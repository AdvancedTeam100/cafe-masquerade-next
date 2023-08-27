import { storage } from '@/libs/firebase';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import { ThunkAction } from '@/store';
import { actions } from './slice';
import { HomeContentParams } from '.';

export const get = (): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestGet());
  try {
    const homeQuerySnap = await contentDocument('home')
      .withConverter(homeConverter)
      .get();
    const homeContent = homeQuerySnap.data();
    if (homeContent) {
      dispatch(actions.successGet({ homeContent }));
    } else {
      dispatch(actions.failureGet());
    }
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};

export const update = (
  params: HomeContentParams,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());
  try {
    const topImages = await Promise.all(
      params.topImages.map(async (image, i) => {
        if ('url' in image) {
          return image;
        } else {
          const targetImage = image as { file: File; href: string };
          const storageRef = storage.ref();
          const uploadTaskSnap = await storageRef
            .child(`home/topImages/${i}_${new Date().getTime()}`)
            .put(targetImage.file);
          const url: string = await uploadTaskSnap.ref.getDownloadURL();
          return { url, href: targetImage.href };
        }
      }),
    );
    await contentDocument('home').withConverter(homeConverter).update({
      sideLinks: params.sideLinks,
      topImages: topImages,
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
