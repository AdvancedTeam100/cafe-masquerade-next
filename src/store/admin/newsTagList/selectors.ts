import { createSelector } from 'reselect';
import { Store } from '@/store';
import { NewsTagListState } from './index';

export const state = createSelector(
  (state: Store) => state.adminNewsTagList,
  (newsTagList: NewsTagListState) => newsTagList,
);
