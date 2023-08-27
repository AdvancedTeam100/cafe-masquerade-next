import { createSelector } from 'reselect';
import { Store } from '@/store';
import { HomeContentState } from './index';

export const state = createSelector(
  (state: Store) => state.adminHomeContent,
  (homeContent: HomeContentState) => homeContent,
);
