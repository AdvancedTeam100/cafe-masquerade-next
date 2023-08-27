import firebase from 'firebase/app';
import { castCollection } from '@/libs/firebase/firestore/cast';
import {
  castTagCollection,
  castTagConverter,
  castTagDocument,
} from '@/libs/firebase/firestore/castTag';
import { ThunkAction } from '@/store';
import { actions } from './slice';

export const get = (): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestGet());
  try {
    const castTagQuerySnap = await castTagCollection()
      .withConverter(castTagConverter)
      .get();
    const castTags = castTagQuerySnap.docs.map((doc) => doc.data());
    dispatch(actions.successGet({ castTags }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};

export const create = (
  castTagName: string,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestCreate());
  try {
    await castTagDocument(castTagName).withConverter(castTagConverter).set({
      name: castTagName,
    });
    dispatch(actions.successCreate({ castTag: { name: castTagName } }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureCreate());
  }
};

export const deleteTag = (
  castTagName: string,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestDelete());
  try {
    await castTagDocument(castTagName).delete();
    const castListQuerySnap = await castCollection()
      .where('tags', 'array-contains', castTagName)
      .get();
    await Promise.all(
      castListQuerySnap.docs.map(async (doc) => {
        await doc.ref.update({
          tags: firebase.firestore.FieldValue.arrayRemove(castTagName),
        });
      }),
    );
    dispatch(actions.successDelete({ castTagName }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureDelete());
  }
};
