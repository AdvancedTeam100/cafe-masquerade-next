import {
  blockedContactUserConverter,
  blockedContactUserDocument,
  blockedContactUsersCollection,
} from '@/libs/firebase/firestore/blockedContactUser';
import { ThunkAction } from '@/store';
import { BlockedContactUser } from '@/libs/models/blockedContactUser';
import { blockedContactUserListActions } from '../blockedContactUserList';
import { actions } from './slice';
import { BlockedContactUserCreateParams } from '.';

export const get = (
  blockedContactUserId: string,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestGet());
  try {
    const blockedContactUserQuerySnap = await blockedContactUserDocument(
      blockedContactUserId,
    )
      .withConverter(blockedContactUserConverter)
      .get();
    const blockedContactUser = blockedContactUserQuerySnap.data();
    if (blockedContactUser) {
      dispatch(actions.successGet({ blockedContactUser }));
    } else {
      dispatch(actions.failureGet());
    }
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};

export const create = (
  params: BlockedContactUserCreateParams,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestCreate());
  try {
    const alreadyBlockedContactUserDoc = await blockedContactUsersCollection()
      .where('email', '==', params.email)
      .get();
    if (alreadyBlockedContactUserDoc.size >= 1) {
      dispatch(actions.failureCreate());
      failureCallback('このメールアドレスのユーザーはすでにブロック済みです');
      return;
    }

    const blockedContactUserId = blockedContactUsersCollection().doc().id;
    const blockedContactUser: BlockedContactUser = {
      id: blockedContactUserId,
      email: params.email,
      blockedAt: new Date().toISOString(),
    };
    await blockedContactUserDocument(blockedContactUserId)
      .withConverter(blockedContactUserConverter)
      .set(blockedContactUser);
    dispatch(actions.successCreate());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureCreate());
    failureCallback(e?.message ?? '');
    return;
  }
};

export const deleteBlockedContactUser = (
  blockedContactUserId: string,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());
  try {
    await blockedContactUserDocument(blockedContactUserId).delete();
    dispatch(actions.successUpdate());
    dispatch(
      blockedContactUserListActions.removeBlockedContactUserItem({
        blockedContactUserId,
      }),
    );
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdate());
    failureCallback(e?.message ?? '');
    return;
  }
};
