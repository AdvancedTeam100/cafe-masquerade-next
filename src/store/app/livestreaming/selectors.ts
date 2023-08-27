import { createSelector } from 'reselect';
import { Store } from '@/store';
import { checkUserRole } from '@/libs/models/livestreaming';
import { LivestreamingState } from '.';

export const state = createSelector(
  (state: Store) => state.appLivestreaming,
  (livestreaming: LivestreamingState) => {
    if (livestreaming.livestreaming) {
      const { status, recordStatus } = livestreaming.livestreaming;
      const isPreparingChat =
        status === 'Finished' && recordStatus !== 'Transcoded';
      return {
        ...livestreaming,
        isPreparingChat,
      };
    }

    return livestreaming;
  },
);

export const chat = createSelector(
  (state: Store) => state.appLivestreaming,
  ({ livestreaming }) => {
    if (!livestreaming) return { isPreparingChat: false };

    const { status, recordStatus, shouldStartRecording } = livestreaming;
    const isPreparingChat =
      status === 'Finished' &&
      recordStatus !== 'Transcoded' &&
      shouldStartRecording;

    return { isPreparingChat };
  },
);

export const auth = createSelector(
  [(state: Store) => state.appLivestreaming, (state: Store) => state.auth],
  ({ livestreaming, hasAcceptedPass }, { isInitialized, user }) => {
    if (!livestreaming || !isInitialized) {
      return { isAuthenticated: null };
    }

    const isEnabledRole =
      user &&
      checkUserRole({
        requiredRole: livestreaming.requiredRole,
        userRole: user.role,
      });

    return { isAuthenticated: isEnabledRole || hasAcceptedPass };
  },
);
