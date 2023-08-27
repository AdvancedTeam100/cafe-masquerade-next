import { createSelector } from 'reselect';
import { Store } from '@/store';
import { LivestreamingSlotListState } from './index';

export const state = createSelector(
  (state: Store) => state.adminLivestreamingSlotList,
  (livestreamingSlotList: LivestreamingSlotListState) => livestreamingSlotList,
);
