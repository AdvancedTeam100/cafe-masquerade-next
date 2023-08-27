import { AdminRole } from './adminUser';
import { UserRole } from './user';
import { Video, VideoStatus } from './video';

export const LivestreamingStatus = {
  Scheduled: 'Scheduled',
  Streaming: 'Streaming',
  Finished: 'Finished',
} as const;

export type LivestreamingStatus = typeof LivestreamingStatus[keyof typeof LivestreamingStatus];

export const RecordStatus = {
  Recording: 'Recording',
  Processing: 'Processing',
  FilesReady: 'FilesReady',
  UploadedToGCS: 'UploadedToGCS',
  RequestedTranscode: 'RequestedTranscode',
  Transcoded: 'Transcoded',
} as const;

export type RecordStatus = typeof RecordStatus[keyof typeof RecordStatus];

export type Livestreaming = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  status: LivestreamingStatus;
  castId?: string | null;
  requiredRole: UserRole;
  shouldStartRecording: boolean;
  videoConfig?: {
    status: VideoStatus;
    type: Video['type'];
    requiredRole: Video['requiredRole'];
    expiredAt: Video['expiredAt'];
  } | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
  startRecordAt?: string;
  recordScheduleId?: string;
  recordSlotId?: string;
  recordStatus?: RecordStatus;
};

export const checkUserRole = ({
  requiredRole,
  userRole,
}: {
  requiredRole: UserRole;
  userRole: UserRole | AdminRole;
}): boolean => {
  if (
    userRole === 'superAdmin' ||
    userRole === 'admin' ||
    userRole === 'cast'
  ) {
    return true;
  }

  switch (requiredRole) {
    case 'diamond': {
      if (userRole === 'diamond') {
        return true;
      }
      return false;
    }
    case 'platinum': {
      if (userRole === 'diamond' || userRole === 'platinum') {
        return true;
      }
      return false;
    }
    case 'gold': {
      if (
        userRole === 'diamond' ||
        userRole === 'platinum' ||
        userRole === 'gold'
      ) {
        return true;
      }
      return false;
    }
    case 'silver': {
      if (
        userRole === 'diamond' ||
        userRole === 'platinum' ||
        userRole === 'gold' ||
        userRole === 'silver'
      ) {
        return true;
      }
      return false;
    }
    case 'bronze': {
      if (
        userRole === 'diamond' ||
        userRole === 'platinum' ||
        userRole === 'gold' ||
        userRole === 'silver' ||
        userRole === 'bronze'
      ) {
        return true;
      }
      return false;
    }
    case 'normal': {
      if (
        userRole === 'diamond' ||
        userRole === 'platinum' ||
        userRole === 'gold' ||
        userRole === 'silver' ||
        userRole === 'bronze' ||
        userRole === 'normal'
      ) {
        return true;
      }
      return false;
    }
    default:
      return false;
  }
};
