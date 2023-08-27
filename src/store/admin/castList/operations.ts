import { castCollection, castConverter } from '@/libs/firebase/firestore/cast';
import { ThunkAction } from '@/store';
import { actions } from './slice';

export const get = (): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestGet());
  try {
    const castQuerySnap = await castCollection()
      .orderBy('joinedAt', 'desc')
      .withConverter(castConverter)
      .get();
    const castList = castQuerySnap.docs.map((doc) => doc.data());
    dispatch(actions.successGet({ castList }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};
