import { ThunkAction } from '@/store';
import { functions, storage } from '@/libs/firebase';
import { actions } from './slice';
import { AdminUserParams } from '.';

const uploadAvatar = async (avatar: File): Promise<string> => {
  const storageRef = storage.ref();
  const uploadTaskSnap = await storageRef
    .child(`adminUsers/${new Date().getTime()}`)
    .put(avatar);
  return await uploadTaskSnap.ref.getDownloadURL();
};

export const create = (
  params: AdminUserParams,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestCreate());
  try {
    params.publicAvatarUrl = await uploadAvatar(params.publicAvatar);
    const func = functions.httpsCallable('createAdmin');
    await func(params);
    dispatch(actions.successCreate());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureCreate());
    failureCallback(e?.message ?? '');
    return;
  }
};

export const update = (
  uid: string,
  params: AdminUserParams,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());
  try {
    if (params.publicAvatar) {
      params.publicAvatarUrl = await uploadAvatar(params.publicAvatar);
    }
    const func = functions.httpsCallable('updateAdmin');
    await func({ uid, ...params });
    dispatch(actions.successUpdate());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdate());
    failureCallback(e?.message ?? '');
    return;
  }
};

export const deleteAdminUser = (
  uid: string,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestDelete());
  try {
    const func = functions.httpsCallable('deleteAdmin');
    await func({ uid });
    dispatch(actions.successDelete());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureDelete());
    failureCallback(e?.message ?? '');
    return;
  }
};
