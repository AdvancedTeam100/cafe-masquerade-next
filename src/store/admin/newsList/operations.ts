import { newsCollection, newsConverter } from '@/libs/firebase/firestore/news';
import { ThunkAction } from '@/store';
import { actions } from './slice';

export const get = (): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestGet());
  try {
    const newsQuerySnap = await newsCollection()
      .orderBy('publishedAt', 'desc')
      .withConverter(newsConverter)
      .get();
    const newsList = newsQuerySnap.docs.map((doc) => doc.data());
    dispatch(actions.successGet({ newsList }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};
