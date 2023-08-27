import { LivestreamingSlot } from '@/libs/models/livestreamingSlot';
import {
  actions as livestreamingSlotListActions,
  reducer as livestreamingSlotListReducer,
} from './slice';
import * as livestreamingSlotListOperations from './operations';
import * as livestreamingSlotListSelectors from './selectors';

export type LivestreamingSlotListState = {
  isInitialized: boolean;
  isFetching: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  livestreamingSlots: ReadonlyArray<LivestreamingSlot>;
};

export {
  livestreamingSlotListActions,
  livestreamingSlotListReducer,
  livestreamingSlotListOperations,
  livestreamingSlotListSelectors,
};

export type LivestreamingSlotParams = Omit<LivestreamingSlot, 'createdAt'>;
