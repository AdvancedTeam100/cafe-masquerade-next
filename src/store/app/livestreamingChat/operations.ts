import { ThunkAction } from '@/store';
import {
  livestreamingMessageCollection,
  livestreamingMessageConverter,
  livestreamingMessageDocument,
} from '@/libs/firebase/firestore/livestreamingMessage';
import { LivestreamingMessage } from '@/libs/models/livestreamingMessage';
import { actions } from './slice';

export const createMessage = (
  params: Omit<LivestreamingMessage, 'id'>,
): ThunkAction<Promise<void>> => async (dispatch, getState) => {
  const { livestreamingId } = getState().appLivestreamingChat;
  if (!livestreamingId) return;

  dispatch(actions.requestCreateMessage());
  try {
    const docRef = livestreamingMessageCollection(livestreamingId).doc();
    const message: LivestreamingMessage = {
      id: docRef.id,
      ...params,
    };
    await docRef.withConverter(livestreamingMessageConverter).set(message);

    dispatch(actions.successCreateMessage());
  } catch (e) {
    console.log(e);
    dispatch(actions.failureCreateMessage());
  }
};

export const updateMessage = (
  id: string,
  params: Partial<LivestreamingMessage>,
): ThunkAction<Promise<void>> => async (dispatch, getState) => {
  const { livestreamingId } = getState().appLivestreamingChat;
  if (!livestreamingId) return;

  dispatch(actions.requestUpdateMessage({ id }));
  try {
    await livestreamingMessageDocument(livestreamingId, id).update(params);

    dispatch(actions.successUpdateMessage({ id }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdateMessage({ id }));
  }
};

export const deleteMessage = (id: string): ThunkAction<Promise<void>> => async (
  dispatch,
  getState,
) => {
  const { livestreamingId } = getState().appLivestreamingChat;
  if (!livestreamingId) return;

  dispatch(actions.requestDeleteMessage({ id }));
  try {
    await livestreamingMessageDocument(livestreamingId, id).delete();

    dispatch(actions.successDeleteMessage({ id }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureDeleteMessage({ id }));
  }
};
