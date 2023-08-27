import { createSelector } from 'reselect';
import { Store } from '@/store';
import { notNullOrUndefined } from '@/libs/utils/array';
import dayjs from 'dayjs';
import { LivestreamingChatReplayState } from './index';

export const state = createSelector(
  (state: Store) => state.appLivestreamingChatReplay,
  (video: LivestreamingChatReplayState) => video,
);

export const messages = createSelector(
  [(state: Store) => state.appLivestreamingChatReplay],
  (video: LivestreamingChatReplayState) => {
    const allMessages = video.listIds
      .map((id) => video.byId[id])
      .filter(notNullOrUndefined)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const messages =
      allMessages.length > 200 ? allMessages.slice(-100) : allMessages; // 都度Sliceするとパフォーマンスが悪いので200件溜まったら100件に切り捨てる
    return {
      messages,
      displayedId: messages.map((message) => message.id),
    };
  },
);

export const incomingIds = createSelector(
  [(state: Store) => state.appLivestreamingChatReplay],
  ({
    listIds,
    byId,
    startAt,
    unreadIds,
    currentTime,
  }: LivestreamingChatReplayState) => {
    if (!startAt) return [];

    const currentDateString = dayjs(currentTime + startAt)
      .toDate()
      .toISOString();
    return Object.values(byId)
      .filter((message) => {
        if ([...listIds, ...unreadIds].includes(message.id)) return false;
        return currentDateString.localeCompare(message.createdAt) >= 0;
      })
      .map((message) => message.id);
  },
);
