import { createSelector } from 'reselect';
import { Store } from '@/store';
import { LivestreamingState } from './index';

export const state = createSelector(
  (state: Store) => state.adminLivestreaming,
  (livestreaming: LivestreamingState) => livestreaming,
);

export const preparing = createSelector(
  (state: Store) => state.adminLivestreaming,
  ({ livestreaming, livestreamingInfo }) => {
    const hasSetVideoConfig =
      livestreaming &&
      (!livestreaming.shouldStartRecording || livestreaming.videoConfig)
        ? true
        : false;
    const hasSetInfo =
      livestreamingInfo && !(livestreamingInfo.encodedUrl === '')
        ? true
        : false;

    return {
      hasSetVideoConfig,
      hasSetInfo,
      isReadyForStreaming: hasSetInfo && hasSetVideoConfig,
    };
  },
);
