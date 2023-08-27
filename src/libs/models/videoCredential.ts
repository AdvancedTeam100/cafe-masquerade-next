import { VideoRequiredRole } from './video';

export type VideoCredentialId = 'info';

export type VideoCredential = VideoInfo;

export type VideoInfo = {
  url: string;
  allowedRoles: VideoRequiredRole[];
};
