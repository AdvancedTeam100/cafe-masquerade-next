import { userCollection, userConverter } from '@/libs/firebase/firestore/user';
import { functions } from '@/libs/firebase';
import { UserRole } from '@/libs/models/user';
import { ThunkAction } from '@/store';
import { actions } from './slice';

export const get = (): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestGet());
  try {
    const userQuerySnap = await userCollection()
      .orderBy('createdAt', 'desc')
      .withConverter(userConverter)
      .get();
    const userList = userQuerySnap.docs.map((doc) => doc.data());
    dispatch(actions.successGet({ userList }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};

export const updateRole = (
  uid: string,
  role: UserRole,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdateRole({ uid }));
  try {
    const func = functions.httpsCallable('updateUserRole');
    await func({ uid, role });
    dispatch(actions.successUpdateRole({ uid, role }));
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdateRole({ uid }));
    failureCallback(e?.message ?? '');
  }
};

export const updateAllUsersRole = (
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestGet());
  try {
    const func = functions.httpsCallable('updateAllUsersRole');
    await func();
    const userQuerySnap = await userCollection()
      .orderBy('createdAt', 'desc')
      .withConverter(userConverter)
      .get();
    const userList = userQuerySnap.docs.map((doc) => doc.data());
    dispatch(actions.successGet({ userList }));
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
    failureCallback(e?.message ?? '');
  }
};
