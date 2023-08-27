import { Video } from '@/libs/models/video';
import { VideoInfo } from '@/libs/models/videoCredential';
import { actions as videoActions, reducer as videoReducer } from './slice';
import * as videoOperations from './operations';
import * as videoSelectors from './selectors';

export type VideoState = {
  isFetching: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isRequestingTranscode: boolean;
  isEnableToPlay: boolean;
  videoId: string | null;
  video: Video | null;
  videoInfo: VideoInfo | null;
};

export type VideoParams = Omit<
  Video,
  'id' | 'wasLivestreaming' | 'createdAt' | 'updatedAt' | 'uploadStatus'
>;

export { videoActions, videoReducer, videoOperations, videoSelectors };
