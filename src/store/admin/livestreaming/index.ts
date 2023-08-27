import { Livestreaming } from '@/libs/models/livestreaming';
import {
  LivestreamingInfo,
  LivestreamingPassword,
} from '@/libs/models/livestreamingCredential';
import {
  actions as livestreamingActions,
  reducer as livestreamingReducer,
} from './slice';
import * as livestreamingOperations from './operations';
import * as livestreamingSelectors from './selectors';

export type LivestreamingState = {
  isFetching: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  livestreaming: Livestreaming | null;
  livestreamingPassword: LivestreamingPassword | null;
  livestreamingInfo: LivestreamingInfo | null;
};

export type LivestreamingCreateParams = Pick<
  Livestreaming,
  | 'title'
  | 'description'
  | 'publishedAt'
  | 'requiredRole'
  | 'videoConfig'
  | 'shouldStartRecording'
> & {
  thumbnail: File;
  password: string;
  rawPassword: string;
  castId: string | null;
};

export type LivestreamingUpdateParams = Pick<
  Livestreaming,
  'title' | 'description' | 'publishedAt' | 'requiredRole'
> & {
  thumbnail?: File;
  thumbnailUrl: string;
  password: string;
  rawPassword: string;
};

export type UpdateVideoConfigParams = {
  shouldStartRecording: boolean;
  videoConfig: Livestreaming['videoConfig'];
};

export {
  livestreamingActions,
  livestreamingReducer,
  livestreamingOperations,
  livestreamingSelectors,
};
