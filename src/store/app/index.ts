import { VideoState, videoReducer } from './video';
import { LivestreamingState, livestreamingReducer } from './livestreaming';
import {
  LivestreamingChatState,
  livestreamingChatReducer,
} from './livestreamingChat';
import {
  LivestreamingChatReplayState,
  livestreamingChatReplayReducer,
} from './livestreamingChatReplay';

export type AppStore = {
  appLivestreamingChatReplay: LivestreamingChatReplayState;
  appVideo: VideoState;
  appLivestreaming: LivestreamingState;
  appLivestreamingChat: LivestreamingChatState;
};

export const appReducers = {
  appLivestreamingChatReplay: livestreamingChatReplayReducer,
  appVideo: videoReducer,
  appLivestreaming: livestreamingReducer,
  appLivestreamingChat: livestreamingChatReducer,
};
