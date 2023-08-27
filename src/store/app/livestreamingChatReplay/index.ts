import { LivestreamingMessage } from '@/libs/models/livestreamingMessage';
import {
  actions as livestreamingChatReplayActions,
  reducer as livestreamingChatReplayReducer,
} from './slice';
import * as livestreamingChatReplayOperations from './operations';
import * as livestreamingChatReplaySelectors from './selectors';

export const FETCH_TIME_LENGTH = 20000;
export const FETCH_INTERVAL = 10000;

export type LivestreamingChatReplayState = {
  isFetchingMessages: boolean;
  isFetchingNewMessages: boolean;
  byId: Record<string, LivestreamingMessage>;
  livestreamingId: string | null;
  startAt: number | null;
  currentTime: number;
  lastFetchTime: number;
  listIds: string[];
  unreadIds: string[];
};

export {
  livestreamingChatReplayActions,
  livestreamingChatReplayReducer,
  livestreamingChatReplayOperations,
  livestreamingChatReplaySelectors,
};
