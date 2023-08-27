import {
  blockedContactUserConverter,
  blockedContactUsersCollection,
} from '@/libs/firebase/firestore/blockedContactUser';
import { ThunkAction } from '@/store';
import { actions } from './slice';

export const get = (): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestGet());
  try {
    const blockedContactUserQuery = await blockedContactUsersCollection()
      .orderBy('blockedAt', 'desc')
      .withConverter(blockedContactUserConverter)
      .get();
    const blockedContactUserList = blockedContactUserQuery.docs.map((doc) =>
      doc.data(),
    );

    dispatch(actions.successGet({ blockedContactUserList }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};
