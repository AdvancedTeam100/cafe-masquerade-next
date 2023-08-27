import firebase from 'firebase/app';
import { newsCollection } from '@/libs/firebase/firestore/news';
import {
  newsTagCollection,
  newsTagConverter,
  newsTagDocument,
} from '@/libs/firebase/firestore/newsTag';
import { ThunkAction } from '@/store';
import { actions } from './slice';

export const get = (): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestGet());
  try {
    const newsTagQuerySnap = await newsTagCollection()
      .withConverter(newsTagConverter)
      .get();
    const newsTags = newsTagQuerySnap.docs.map((doc) => doc.data());
    dispatch(actions.successGet({ newsTags }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};

export const create = (
  newsTagName: string,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestCreate());
  try {
    await newsTagDocument(newsTagName).withConverter(newsTagConverter).set({
      name: newsTagName,
    });
    dispatch(actions.successCreate({ newsTag: { name: newsTagName } }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureCreate());
  }
};

export const deleteTag = (
  newsTagName: string,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestDelete());
  try {
    await newsTagDocument(newsTagName).delete();
    const newsListQuerySnap = await newsCollection()
      .where('tags', 'array-contains', newsTagName)
      .get();
    await Promise.all(
      newsListQuerySnap.docs.map(async (doc) => {
        await doc.ref.update({
          tags: firebase.firestore.FieldValue.arrayRemove(newsTagName),
        });
      }),
    );
    dispatch(actions.successDelete({ newsTagName }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureDelete());
  }
};
