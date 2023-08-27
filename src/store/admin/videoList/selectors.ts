import { createSelector } from 'reselect';
import { Store } from '@/store';
import { VideoListState } from './index';

export const state = createSelector(
  (state: Store) => state.adminVideoList,
  (videoList: VideoListState) => videoList,
);
