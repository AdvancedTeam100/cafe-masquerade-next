import { Video } from '@/libs/models/video';
import {
  actions as videoListActions,
  reducer as videoListReducer,
} from './slice';
import * as videoListOperations from './operations';
import * as videoListSelectors from './selectors';

export type VideoListState = {
  isFetching: boolean;
  videoList: ReadonlyArray<Video>;
};

export {
  videoListActions,
  videoListReducer,
  videoListOperations,
  videoListSelectors,
};
