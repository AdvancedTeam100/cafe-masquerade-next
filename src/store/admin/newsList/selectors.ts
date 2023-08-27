import { createSelector } from 'reselect';
import { Store } from '@/store';
import { NewsListState } from './index';

export const state = createSelector(
  (state: Store) => state.adminNewsList,
  (newsList: NewsListState) => newsList,
);
