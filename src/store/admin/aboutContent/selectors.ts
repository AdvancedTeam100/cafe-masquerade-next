import { createSelector } from 'reselect';
import { Store } from '@/store';
import { AboutContentState } from './index';

export const state = createSelector(
  (state: Store) => state.adminAboutContent,
  (aboutContent: AboutContentState) => aboutContent,
);
