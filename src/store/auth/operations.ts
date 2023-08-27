/* eslint-disable @typescript-eslint/no-explicit-any */
import firebase, { functions, storage } from '@/libs/firebase';
import {
  adminUserConverter,
  adminUserDocument,
} from '@/libs/firebase/firestore/adminUser';
import { AdminRole, isAdmin } from '@/libs/models/adminUser';
import { UserRole } from '@/libs/models/user';
import { ThunkAction } from '@/store';
import { userConverter, userDocument } from '@/libs/firebase/firestore/user';
import { actions } from './slice';
import { AuthUser, AuthUserParams } from '.';

type Role = AdminRole | UserRole | undefined;

const getAuthUser = async (uid: string, role: Role): Promise<AuthUser> => {
  let authUser: AuthUser | undefined;
  if (isAdmin(role)) {
    const snap = await adminUserDocument(uid)
      .withConverter(adminUserConverter)
      .get();
    authUser = snap.data();
  } else {
    const snap = await userDocument(uid).withConverter(userConverter).get();
    authUser = snap.data();
  }
  if (!authUser) throw new Error('Auth user not found');
  return authUser;
};

export const checkAuth = (
  successCallback: () => void,
  failureCallback: () => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestAuth());
  try {
    const redirectResult = await firebase.auth().getRedirectResult();
    if (redirectResult.user) {
      if (redirectResult?.additionalUserInfo?.isNewUser) {
        // 新規Adminユーザーは受け付けないので削除する
        const newUser = firebase.auth().currentUser;
        if (newUser) {
          await newUser.delete();
          dispatch(
            actions.failureAuth({ errorCode: 'auth/unregistered-user' }),
          );
          failureCallback();
        } else {
          throw new Error();
        }
      } else {
        const { claims, token } = await redirectResult.user.getIdTokenResult(
          true,
        );
        const user = await getAuthUser(redirectResult.user.uid, claims?.role);
        dispatch(actions.successAuth({ user, token }));
        successCallback();
        if (isAdmin(user.role)) {
          await adminUserDocument(user.uid).update({
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            updatedAt: new Date(),
          });
        }
      }
    } else {
      firebase.auth().onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          const { claims, token } = await firebaseUser.getIdTokenResult(true);
          const user = await getAuthUser(firebaseUser.uid, claims?.role);
          dispatch(actions.successAuth({ user, token }));
        } else {
          dispatch(actions.failureAuth({}));
        }
      });
    }
  } catch (e) {
    console.log(e);
    dispatch(
      actions.failureAuth({ errorCode: e.code ?? 'auth/unregistered-user' }),
    );
    failureCallback();
  }
};

export const signInWithToken = (
  token: string,
  successCallback: () => void,
  failureCallback: () => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestAuth());
  try {
    const { user: firebaseUser } = await firebase
      .auth()
      .signInWithCustomToken(token);
    if (firebaseUser) {
      const { claims, token } = await firebaseUser.getIdTokenResult(true);
      const user = await getAuthUser(firebaseUser.uid, claims?.role);
      dispatch(actions.successAuth({ user, token }));
      successCallback();
    } else {
      dispatch(actions.failureAuth({}));
    }
  } catch (e) {
    console.log(e);
    dispatch(
      actions.failureAuth({ errorCode: e.code ?? 'auth/unregistered-user' }),
    );
    failureCallback();
  }
};

export const signOut = (
  successCallback: () => void,
  failureCallback: () => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestAuth());
  try {
    await firebase.auth().signOut();
    dispatch(actions.successResetAuth());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureAuth({}));
    failureCallback();
  }
};

export const update = (
  authUser: AuthUser,
  updateParams: AuthUserParams,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());
  try {
    let avatarUrl = authUser.avatarUrl;
    if (updateParams.avatar) {
      const storageRef = storage.ref();
      const uploadTaskSnap = await storageRef
        .child(`users/${authUser.uid}`)
        .put(updateParams.avatar);
      avatarUrl = await uploadTaskSnap.ref.getDownloadURL();
    }
    const params: Pick<
      AuthUser,
      | 'avatarUrl'
      | 'displayName'
      | 'email'
      | 'dateOfBirth'
      | 'sex'
      | 'prefecture'
    > = {
      avatarUrl,
      displayName: updateParams.displayName,
      email: updateParams.email,
      dateOfBirth: updateParams.dateOfBirth,
      sex: updateParams.sex,
      prefecture: updateParams.prefecture,
    };
    const func = functions.httpsCallable('updateAuthUser');
    await func({ uid: authUser.uid, params });
    const user: AuthUser = {
      ...authUser,
      ...params,
    };
    dispatch(actions.successUpdate({ user }));
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdate());
    failureCallback(e?.message ?? '');
    return;
  }
};

export const deleteAuthUser = (
  uid: string,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestDelete());
  try {
    const func = functions.httpsCallable('deleteAuthUser');
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

export const isAdminAuthenticated = (
  user: AuthUser | null | undefined,
  requiredRole?: AdminRole, // superAdmin > admin > cast の順序が前提
): boolean => {
  if (!user || !isAdmin(user.role)) {
    return false;
  }

  const { role } = user;
  switch (requiredRole) {
    case 'superAdmin': {
      if (role !== 'superAdmin') {
        return false;
      }
      return true;
    }
    case 'admin': {
      if (role !== 'admin' && role !== 'superAdmin') {
        return false;
      }
      return true;
    }
    case 'cast': {
      if (role !== 'cast' && role !== 'admin' && role !== 'superAdmin') {
        return false;
      }
      return true;
    }
    default:
      return true;
  }
};
