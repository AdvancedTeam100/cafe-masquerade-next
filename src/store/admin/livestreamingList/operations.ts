import {
  livestreamingCollection,
  livestreamingConverter,
} from '@/libs/firebase/firestore/livestreaming';
import { ThunkAction } from '@/store';
import { LivestreamingStatus } from '@/libs/models/livestreaming';
import { actions } from './slice';

export const get = (): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestGet());
  const yesterday = new Date();
  yesterday.setDate(new Date().getDate() - 1);
  try {
    const [
      streamingQuerySnap,
      scheduledQuerySnap,
      finishedQuerySnap,
    ] = await Promise.all([
      await livestreamingCollection()
        .where('status', '==', LivestreamingStatus.Streaming)
        .orderBy('publishedAt', 'asc')
        .withConverter(livestreamingConverter)
        .get(),
      await livestreamingCollection()
        .where('status', '==', LivestreamingStatus.Scheduled)
        .orderBy('publishedAt', 'asc')
        .withConverter(livestreamingConverter)
        .get(),
      await livestreamingCollection()
        .where('status', '==', LivestreamingStatus.Finished)
        .orderBy('publishedAt', 'asc')
        .where('publishedAt', '>', yesterday)
        .withConverter(livestreamingConverter)
        .get(),
    ]);
    const streamingList = streamingQuerySnap.docs.map((doc) => doc.data());
    const scheduledList = scheduledQuerySnap.docs.map((doc) => doc.data());
    const finishedList = finishedQuerySnap.docs.map((doc) => doc.data());
    dispatch(actions.setStreamingList({ livestreamings: streamingList }));
    dispatch(actions.setScheduledList({ livestreamings: scheduledList }));
    dispatch(actions.setFinishedList({ livestreamings: finishedList }));
    dispatch(actions.successGet());
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};
