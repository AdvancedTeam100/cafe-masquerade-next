import { createSelector } from 'reselect';
import { Store } from '@/store';
import { notNull } from '@/libs/utils/array';
import { AuthState } from '@/store/auth';
import { Video, checkUserPermission } from '@/libs/models/video';
import { checkUserRole } from '@/libs/models/livestreaming';
import { LIMIT_PER_REQUEST, VideoState } from './index';

export const state = createSelector(
  (state: Store) => state.appVideo,
  (video: VideoState) => video,
);

export const videoList = createSelector(
  [(state: Store) => state.appVideo, (state: Store) => state.auth],
  (
    { listIds, byId, isFetchingList, isInitialized, filter }: VideoState,
    { isInitialized: isInitializedAuth, user }: AuthState,
  ) => {
    let videos: Video[] = [];
    const allVideos = listIds.map((videoId) => byId[videoId]).filter(notNull);
    if (isInitializedAuth) {
      videos = allVideos.filter((video) => {
        const displayResult =
          filter.display === 'all' ||
          checkUserPermission({
            userRole: user?.role ?? 'nonUser',
            expiredAt: video.expiredAt,
          });
        const castIdResult =
          filter.castId === '' || video.castId === filter.castId;
        const videoTypeResult =
          filter.videoType === 'all' || video.type === filter.videoType;
        return (
          displayResult &&
          castIdResult &&
          videoTypeResult &&
          video.uploadStatus === 'Transcoded'
        );
      });
    }
    return {
      videos,
      isInitialized,
      hasMore: allVideos.length % LIMIT_PER_REQUEST === 0,
      isFetchingList,
    };
  },
);

export const archive = createSelector(
  [(state: Store) => state.appVideo, (state: Store) => state.auth],
  ({ targetVideoId, byId }: VideoState, { isInitialized, user }: AuthState) => {
    if (!targetVideoId) {
      return {
        isEnabledRole: null,
        isEnabledExpired: null,
        targetVideo: null,
      };
    }

    const targetVideo = byId[targetVideoId];

    if (!targetVideo) {
      return {
        isEnabledRole: null,
        isEnabledExpired: null,
        targetVideo: null,
      };
    }

    if (!targetVideo?.requiredRole) {
      return {
        isEnabledRole: true,
        isEnabledExpired: true,
        targetVideo,
      };
    }

    if (targetVideo.requiredRole === 'nonUser') {
      const isEnabledExpired = checkUserPermission({
        expiredAt: targetVideo.expiredAt,
        userRole: 'nonUser',
      });
      return {
        isEnabledRole: true,
        isEnabledExpired,
        targetVideo,
      };
    }

    if (!isInitialized || !user) {
      return {
        isEnabledRole: false,
        isEnabledExpired: false,
        targetVideo,
      };
    }

    const isEnabledRole = checkUserRole({
      requiredRole: targetVideo.requiredRole,
      userRole: user.role,
    });
    const isEnabledExpired = checkUserPermission({
      expiredAt: targetVideo.expiredAt,
      userRole: user.role,
    });

    return {
      isEnabledRole,
      isEnabledExpired,
      targetVideo,
    };
  },
);
