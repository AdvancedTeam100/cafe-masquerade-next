import { createSelector } from 'reselect';
import { Store } from '@/store';
import { CastState } from './index';

export const state = createSelector(
  (state: Store) => state.adminCast,
  (cast: CastState) => cast,
);
