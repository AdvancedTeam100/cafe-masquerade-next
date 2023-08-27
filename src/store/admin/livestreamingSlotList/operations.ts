import { ThunkAction } from '@/store';
import {
  livestreamingSlotCollection,
  livestreamingSlotConverter,
  livestreamingSlotDocument,
} from '@/libs/firebase/firestore/livestreamingSlot';
import { actions } from './slice';
import { LivestreamingSlotParams } from '.';

export const get = (): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestGet());
  try {
    const livestreamingSlotQuerySnap = await livestreamingSlotCollection()
      .withConverter(livestreamingSlotConverter)
      .orderBy('createdAt', 'desc')
      .get();
    const livestreamingSlots = livestreamingSlotQuerySnap.docs.map((doc) =>
      doc.data(),
    );
    dispatch(actions.successGet({ livestreamingSlots }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};

export const create = (
  params: LivestreamingSlotParams,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestCreate());
  try {
    await livestreamingSlotDocument(params.name)
      .withConverter(livestreamingSlotConverter)
      .set({
        ...params,
        createdAt: new Date().toISOString(),
      });
    dispatch(actions.successCreate());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureCreate());
    failureCallback(e?.message ?? '');
  }
};

export const update = (
  params: LivestreamingSlotParams,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());
  try {
    await livestreamingSlotDocument(params.name)
      .withConverter(livestreamingSlotConverter)
      .update(params);
    dispatch(actions.successUpdate());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdate());
    failureCallback(e?.message ?? '');
  }
};

export const deleteSlot = (
  name: string,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());
  try {
    await livestreamingSlotDocument(name).delete();
    dispatch(actions.successUpdate());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdate());
    failureCallback(e?.message ?? '');
  }
};
