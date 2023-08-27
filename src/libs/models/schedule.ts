import { LivestreamingStatus } from './livestreaming';
import { YoutubeVideo } from './youtubeVideo';

export const ScheduleType = {
  Holiday: 'Holiday',
  Canceled: 'Canceled',
  YouTube: 'YouTube', // YouTube
  Twitcasting: 'Twitcasting', // ツイキャス
  Niconico: 'Niconico', // ニコニコ
  Twitch: 'Twitch', // Twitch
  FC2: 'FC2', // FC2
  TikTok: 'TikTok', // TikTok
  None: 'None',
  LiveAction: 'LiveAction', // ますかれーど
  AfterTalk: 'AfterTalk', // ますかれーど
  LimitedBefore: 'LimitedBefore', // ますかれーど
  LimitedOnly: 'LimitedOnly', // ますかれーど
} as const;

export type ScheduleType = typeof ScheduleType[keyof typeof ScheduleType];

export type Schedule = {
  id: string;
  title: string;
  castId: string;
  type: ScheduleType;
  startAt: string;
  endAt: string;
  url: string;
  youtubeVideo?: YoutubeVideo;
  isActive?: boolean;
  livestreaming?: {
    id: string;
    title: string;
    thumbnailUrl: string;
    status: LivestreamingStatus;
  };
};

export const getScheduleTypeDisplayName = (type: ScheduleType) => {
  switch (type) {
    case 'LiveAction':
      return '実写お給仕♡';
    case 'AfterTalk':
      return 'アフターあり♡';
    case 'LimitedBefore':
      return '限定同伴配信♡';
    case 'LimitedOnly':
      return '限定店外配信♡';
    default:
      return '';
  }
};

export const checkIsLivestreaming = (type: ScheduleType) => {
  switch (type) {
    case ScheduleType.LiveAction:
    case ScheduleType.AfterTalk:
    case ScheduleType.LimitedBefore:
    case ScheduleType.LimitedOnly:
      return true;
    default:
      return false;
  }
};
