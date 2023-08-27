import { createSelector } from 'reselect';
import { Store } from '@/store';
import { CastListState } from './index';

export const state = createSelector(
  (state: Store) => state.adminCastList,
  (castList: CastListState) => castList,
);
