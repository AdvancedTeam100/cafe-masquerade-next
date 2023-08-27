import {
  adminUserCollection,
  adminUserConverter,
} from '@/libs/firebase/firestore/adminUser';
import { ThunkAction } from '@/store';
import { actions } from './slice';

export const get = (): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestGet());
  try {
    const adminUserQuerySnap = await adminUserCollection()
      .orderBy('createdAt', 'desc')
      .withConverter(adminUserConverter)
      .get();
    const adminUserList = adminUserQuerySnap.docs.map((doc) => doc.data());
    dispatch(actions.successGet({ adminUserList }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};
