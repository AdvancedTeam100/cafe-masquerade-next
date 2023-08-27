import { createSelector } from 'reselect';
import { Store } from '@/store';
import { CastTagListState } from './index';

export const state = createSelector(
  (state: Store) => state.adminCastTagList,
  (castTagList: CastTagListState) => castTagList,
);
