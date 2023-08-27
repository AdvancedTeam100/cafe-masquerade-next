import { createSelector } from 'reselect';
import { Store } from '@/store';
import { RouterState } from './index';

export const state = createSelector(
  (state: Store) => state.router,
  (router: RouterState) => router,
);
