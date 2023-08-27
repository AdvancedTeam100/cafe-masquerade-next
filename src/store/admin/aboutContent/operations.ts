import {
  aboutConverter,
  contentDocument,
} from '@/libs/firebase/firestore/content';
import { ThunkAction } from '@/store';
import { actions } from './slice';
import { AboutContentParams } from '.';

export const get = (): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestGet());
  try {
    const aboutQuerySnap = await contentDocument('about')
      .withConverter(aboutConverter)
      .get();
    const aboutContent = aboutQuerySnap.data();
    if (aboutContent) {
      dispatch(actions.successGet({ aboutContent }));
    } else {
      dispatch(actions.failureGet());
    }
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};

export const update = (
  params: AboutContentParams,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());
  try {
    await contentDocument('about').withConverter(aboutConverter).update({
      contents: params.contents,
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
