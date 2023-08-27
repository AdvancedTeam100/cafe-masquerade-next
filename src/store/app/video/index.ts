import { Video, VideoType } from '@/libs/models/video';
import { actions as videoActions, reducer as videoReducer } from './slice';
import * as videoOperations from './operations';
import * as videoSelectors from './selectors';

export type VideoState = {
  isFetchingVideo: boolean;
  targetVideoId: string | null;
  isFetchingList: boolean;
  isInitialized: boolean;
  byId: Record<string, Video>;
  listIds: string[];
  filter: VideoFilter;
};

export const LIMIT_PER_REQUEST = 30;

export { videoActions, videoReducer, videoOperations, videoSelectors };

export type VideoFilter = {
  castId: string;
  display: 'all' | 'available';
  videoType: 'all' | VideoType;
  orderBy: 'asc' | 'desc';
};
