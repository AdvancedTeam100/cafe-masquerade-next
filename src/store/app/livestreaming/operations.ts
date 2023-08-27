import { functions } from '@/libs/firebase';
import {
  livestreamingConverter,
  livestreamingDocument,
} from '@/libs/firebase/firestore/livestreaming';
import {
  livestreamingCredentialDocument,
  livestreamingInfoConverter,
} from '@/libs/firebase/firestore/livestreamingCredential';
import { ThunkAction } from '@/store';
import { actions } from './slice';

export const get = (
  livestreamingId: string,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestGet());
  try {
    const livestreamingSnap = await livestreamingDocument(livestreamingId)
      .withConverter(livestreamingConverter)
      .get();

    const livestreaming = livestreamingSnap.data();

    if (livestreaming) {
      dispatch(actions.successGet({ livestreaming }));
    } else {
      dispatch(actions.failureGet());
    }
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};

export const getInfo = (): ThunkAction<Promise<void>> => async (
  dispatch,
  getState,
) => {
  const { livestreaming } = getState().appLivestreaming;

  if (!livestreaming || !livestreaming.id) return;

  dispatch(actions.requestGetInfo());
  try {
    const info = (
      await livestreamingCredentialDocument(livestreaming.id, 'info')
        .withConverter(livestreamingInfoConverter)
        .get()
    ).data();

    if (!info) {
      throw new Error(
        `infoドキュメントが存在しません．livestreamingId: ${livestreaming.id}`,
      );
    }

    dispatch(actions.successGetInfo({ info }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGetInfo());
  }
};

export const checkPassword = (
  livestreamingId: string,
  password: string,
  onSuccess?: () => void,
  onUnMatch?: () => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestCheckPass());
  try {
    const func = functions.httpsCallable('checkLivestreamingPassword');
    const {
      data: { hasAccepted, info },
    } = await func({
      inputPassword: password,
      livestreamingId,
    });

    onSuccess && onSuccess();

    if (!hasAccepted && onUnMatch) {
      onUnMatch();
    }
    dispatch(actions.successCheckPass({ hasAccepted, info }));
  } catch (e) {
    dispatch(actions.failureCheckPass());
    console.log(e);
  }
};
