import { createSelector } from 'reselect';
import { Store } from '@/store';
import { VideoState } from './index';

export const state = createSelector(
  (state: Store) => state.adminVideo,
  (video: VideoState) => video,
);
