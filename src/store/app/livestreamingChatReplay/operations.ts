import { ThunkAction } from '@/store';
import dayjs from 'dayjs';
import {
  livestreamingMessageCollection,
  livestreamingMessageConverter,
} from '@/libs/firebase/firestore/livestreamingMessage';
import { actions } from './slice';
import { FETCH_INTERVAL, FETCH_TIME_LENGTH } from '.';

export const getMessages = (): ThunkAction<Promise<void>> => async (
  dispatch,
  getState,
) => {
  const {
    currentTime,
    startAt,
    livestreamingId,
  } = getState().appLivestreamingChatReplay;
  if (!startAt || !livestreamingId) return;
  dispatch(actions.requestGetMessages());
  try {
    const startAfterDate = dayjs(
      currentTime + startAt + FETCH_TIME_LENGTH,
    ).toDate();
    const messagesQuerySnap = await livestreamingMessageCollection(
      livestreamingId,
    )
      .orderBy('createdAt', 'desc')
      .startAfter(startAfterDate)
      .limit(100)
      .withConverter(livestreamingMessageConverter)
      .get();
    const messages = messagesQuerySnap.docs.map((doc) => doc.data());
    dispatch(actions.successGetMessages({ messages, currentTime }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGetMessages());
  }
};

export const getNewMessages = (): ThunkAction<Promise<void>> => async (
  dispatch,
  getState,
) => {
  const {
    currentTime,
    startAt,
    livestreamingId,
    lastFetchTime,
  } = getState().appLivestreamingChatReplay;
  if (!startAt || !livestreamingId) return;
  dispatch(actions.requestGetNewMessages());
  try {
    const startAfterDate = dayjs(
      currentTime + startAt + FETCH_TIME_LENGTH,
    ).toDate();
    const endBeforeDate = dayjs(
      lastFetchTime + startAt + FETCH_TIME_LENGTH,
    ).toDate();
    const messagesQuerySnap = await livestreamingMessageCollection(
      livestreamingId,
    )
      .orderBy('createdAt', 'desc')
      .startAfter(startAfterDate)
      .endBefore(endBeforeDate)
      .limit(100)
      .withConverter(livestreamingMessageConverter)
      .get();
    const messages = messagesQuerySnap.docs.map((doc) => doc.data());
    dispatch(actions.successGetNewMessages({ messages, currentTime }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGetNewMessages());
  }
};

export const updateCurrentTime = (
  currentTime: number,
): ThunkAction<Promise<void>> => async (dispatch, getState) => {
  const {
    currentTime: prevTime,
    lastFetchTime,
  } = getState().appLivestreamingChatReplay;

  dispatch(actions.setCurrentTime({ currentTime }));
  if (Math.abs(currentTime - prevTime) >= FETCH_INTERVAL) {
    dispatch(actions.setListIds({ ids: [] }));
    dispatch(actions.setUnreadIds({ ids: [] }));
    dispatch(getMessages());
  } else if (Math.abs(currentTime - lastFetchTime) >= FETCH_INTERVAL) {
    dispatch(getNewMessages());
  }
};
