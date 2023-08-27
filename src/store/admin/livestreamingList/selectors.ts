import { createSelector } from 'reselect';
import { Store } from '@/store';
import { LivestreamingListState } from './index';

export const state = createSelector(
  (state: Store) => state.adminLivestreamingList,
  (livestreamingList: LivestreamingListState) => livestreamingList,
);
