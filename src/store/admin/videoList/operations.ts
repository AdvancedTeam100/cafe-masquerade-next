import {
  videoCollection,
  videoConverter,
} from '@/libs/firebase/firestore/video';
import { ThunkAction } from '@/store';
import { actions } from './slice';

export const get = (): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestGet());
  try {
    const videoQuerySnap = await videoCollection()
      .orderBy('publishedAt', 'desc')
      .withConverter(videoConverter)
      .get();
    const videoList = videoQuerySnap.docs.map((doc) => doc.data());
    dispatch(actions.successGet({ videoList }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};
