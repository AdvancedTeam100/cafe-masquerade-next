import { createSelector } from 'reselect';
import { Store } from '@/store';
import { NewsState } from './index';

export const state = createSelector(
  (state: Store) => state.adminNews,
  (news: NewsState) => news,
);
