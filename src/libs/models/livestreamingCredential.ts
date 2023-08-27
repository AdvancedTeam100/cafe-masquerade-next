import { getTomorrowUnixtime } from '../utils/dateFormat';
import { createMd5Hash } from '../utils/encryption';

export type LivestreamingCredentialId = 'password' | 'info';

export type LivestreamingCredential = LivestreamingPassword | LivestreamingInfo;

export type LivestreamingPassword = {
  password: string;
  rawPassword: string;
};

export type LivestreamingInfo = {
  slotName: string;
  encodedUrl: string;
  // NOTE: 以下はRTS
  shortName?: string;
  streamName?: string;
  host?: string;
  sharedSecret?: string;
  publishedHostName?: string;
};

export const getEncodedUrl = ({
  playbackUrl,
  publishedAt,
  sharedSecret,
}: {
  playbackUrl: string;
  publishedAt: string;
  sharedSecret: string;
}) => {
  const originalUrl = playbackUrl
    .replace(/^http[s]?:/i, 'https:')
    .replace(/\/manifest.m3u8.+/, '');
  const expireDate = getTomorrowUnixtime(new Date(publishedAt));
  const inputData = `${sharedSecret}${originalUrl}?p=${originalUrl.length}&e=${expireDate}`;
  const hash = createMd5Hash(inputData);
  return `${originalUrl}/manifest.m3u8?p=${originalUrl.length}&e=${expireDate}&h=${hash}`;
};
