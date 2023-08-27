import { LivestreamingMessage } from '@/libs/models/livestreamingMessage';
import {
  actions as livestreamingChatActions,
  reducer as livestreamingChatReducer,
} from './slice';
import * as livestreamingChatOperations from './operations';
import * as livestreamingChatSelectors from './selectors';

export type LivestreamingChatState = {
  livestreamingId: string | null;
  byId: Record<string, LivestreamingMessage>;
  listIds: string[];
  unreadIds: string[];
  fixedIds: string[];
  isCreating: boolean;
  updatingMessageids: string[];
  deletingMessageIds: string[];
  hasEndReached: boolean;
};

export {
  livestreamingChatActions,
  livestreamingChatReducer,
  livestreamingChatOperations,
  livestreamingChatSelectors,
};
