import { Livestreaming } from '@/libs/models/livestreaming';
import { LivestreamingInfo } from '@/libs/models/livestreamingCredential';
import {
  actions as livestreamingActions,
  reducer as livestreamingReducer,
} from './slice';
import * as livestreamingOperations from './operations';
import * as livestreamingSelectors from './selectors';

export type LivestreamingState = {
  livestreaming: Livestreaming | null;
  info: LivestreamingInfo | null;
  isFetching: boolean;
  isCheckingPass: boolean;
  hasAcceptedPass: boolean;
};

export {
  livestreamingActions,
  livestreamingReducer,
  livestreamingOperations,
  livestreamingSelectors,
};
