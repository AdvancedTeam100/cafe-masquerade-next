import { youtube_v3 } from 'googleapis';

export const LiveBroadcastContent = {
  Live: 'live',
  Upcoming: 'upcoming',
  None: 'none',
} as const;

export type LiveBroadcastContent = typeof LiveBroadcastContent[keyof typeof LiveBroadcastContent];

export type YoutubeVideo = {
  id: string;
  channelId: string;
  title: string;
  thumbnails: youtube_v3.Schema$ThumbnailDetails;
  liveBroadcastContent: LiveBroadcastContent;
  liveStreamingDetails: youtube_v3.Schema$VideoLiveStreamingDetails;
  startAt: string;
};
