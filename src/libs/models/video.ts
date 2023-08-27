import dayjs from 'dayjs';
import { isEnableExpiredAt } from '../utils/dateLogic';
import { AdminRole } from './adminUser';
import { userRoleToDisplayName, userRoles } from './user';

export const VideoStatus = {
  Private: 'Private',
  Limited: 'Limited',
  Published: 'Published',
} as const;

export type VideoStatus = typeof VideoStatus[keyof typeof VideoStatus];

export const VideoUploadStatus = {
  RequestedTranscode: 'RequestedTranscode',
  Transcoded: 'Transcoded',
} as const;

export type VideoUploadStatus = typeof VideoUploadStatus[keyof typeof VideoUploadStatus];

export const VideoType = {
  LiveAction: 'LiveAction',
  AfterTalk: 'AfterTalk',
  Other: 'Other',
} as const;

export type VideoType = typeof VideoType[keyof typeof VideoType];

export const videoRequiredRoles = [...userRoles, 'nonUser'] as const;
export type VideoRequiredRole = typeof videoRequiredRoles[number];

export type Video = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  status: VideoStatus;
  uploadStatus?: VideoUploadStatus;
  type: VideoType | null;
  requiredRole: VideoRequiredRole | null;
  expiredAt: Partial<Record<VideoRequiredRole, string | null>> | null;
  wasLivestreaming: boolean;
  finishedAt?: string;
  duration?: number;
  castId?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export const getAllowedRoles = (
  role: VideoRequiredRole | null,
): VideoRequiredRole[] => {
  if (!role) return [];
  const index = videoRequiredRoles.indexOf(role);
  return videoRequiredRoles.slice(0, index + 1);
};

export const checkUserPermission = ({
  userRole,
  expiredAt,
}: {
  userRole: VideoRequiredRole | AdminRole | 'nonUser';
  expiredAt: Video['expiredAt'];
}): boolean => {
  if (
    userRole === 'admin' ||
    userRole === 'superAdmin' ||
    userRole === 'cast'
  ) {
    return true;
  }

  const userExpiredAt = expiredAt?.[userRole];

  if (userExpiredAt === '') {
    // ''の場合は無期限で閲覧可能
    return true;
  } else if (!userExpiredAt) {
    // userExpiredAtがnull or undefinedの場合は閲覧権限がない
    return false;
  }

  return isEnableExpiredAt(userExpiredAt);
};

export const videoStatuses = Object.entries(VideoStatus).map(
  ([_, status]) => status,
);

export const videoStatusToDisplayName: Record<VideoStatus, string> = {
  Private: '非公開',
  Limited: '限定公開',
  Published: '公開',
};

export const videoTypes = Object.entries(VideoType).map(([_, type]) => type);

export const videoTypeToDisplayName: Record<VideoType, string> = {
  LiveAction: '実写お給仕',
  AfterTalk: 'アフタートーク',
  Other: 'その他',
};

export const selectableVideoRequiredRoles = videoRequiredRoles.filter(
  (role) => role !== 'diamond' && role !== 'normal',
);

export const videoRequiredRoleToDisplayName: Record<
  VideoRequiredRole,
  string
> = {
  ...userRoleToDisplayName,
  nonUser: '誰でも',
};

export const isEnablePublic = (video: Video | null | undefined): boolean => {
  return (
    !!video &&
    video.status !== 'Private' &&
    new Date(video.publishedAt) < new Date() &&
    video.uploadStatus !== undefined
  );
};

export const getExpiresOfUnix = ({
  userRole,
  expiredAt,
}: {
  userRole: VideoRequiredRole | AdminRole | 'nonUser';
  expiredAt: Video['expiredAt'];
}): number => {
  if (
    userRole === 'admin' ||
    userRole === 'superAdmin' ||
    userRole === 'cast'
  ) {
    return dayjs().add(1, 'year').unix();
  }

  const userExpiredAt = expiredAt?.[userRole];

  if (userExpiredAt === '') {
    return dayjs().add(1, 'year').unix();
  } else if (!userExpiredAt) {
    return 0;
  }

  return dayjs(new Date(userExpiredAt)).unix();
};
