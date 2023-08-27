import {
  videoCollection,
  videoConverter,
} from '@/libs/firebase/firestore/video';
import { Video, VideoStatus } from '@/libs/models/video';
import { ThunkAction } from '@/store';
import { actions } from './slice';
import { LIMIT_PER_REQUEST } from '.';

export const getList = (): ThunkAction<Promise<void>> => async (
  dispatch,
  getState,
) => {
  const { listIds, byId, filter, isFetchingList } = getState().appVideo;
  if (isFetchingList) return;
  dispatch(actions.requestGetList());
  try {
    const lastPublishedAt =
      byId[listIds[listIds.length - 1] ?? '']?.publishedAt ?? null;

    let query = videoCollection().where('status', 'in', [
      VideoStatus.Published,
      VideoStatus.Limited,
    ]);

    if (
      filter.videoType === 'LiveAction' ||
      filter.videoType === 'AfterTalk' ||
      filter.videoType === 'Other'
    ) {
      query = query.where('type', '==', filter.videoType);
    }

    if (filter.castId !== '') {
      query = query.where('castId', '==', filter.castId);
    }

    query = query
      .orderBy('publishedAt', filter.orderBy)
      .limit(LIMIT_PER_REQUEST)
      .withConverter(videoConverter);

    if (lastPublishedAt) {
      query = query.startAfter(new Date(lastPublishedAt));
    }

    const videoQuerySnap = await query.get();
    const videos = videoQuerySnap.docs.map((doc) => doc.data() as Video);
    dispatch(actions.successGetList({ videos }));
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGetList());
  }
};
