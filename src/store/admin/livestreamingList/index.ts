import { Livestreaming } from '@/libs/models/livestreaming';
import {
  actions as livestreamingListActions,
  reducer as livestreamingListReducer,
} from './slice';
import * as livestreamingListOperations from './operations';
import * as livestreamingListSelectors from './selectors';

export type LivestreamingListState = {
  isInitialized: boolean;
  isFetching: boolean;
  streamingList: ReadonlyArray<Livestreaming>;
  scheduledList: ReadonlyArray<Livestreaming>;
  finishedList: ReadonlyArray<Livestreaming>;
};

export {
  livestreamingListActions,
  livestreamingListReducer,
  livestreamingListOperations,
  livestreamingListSelectors,
};
