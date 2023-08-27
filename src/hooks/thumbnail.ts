import { ScheduleType } from '@/libs/models/schedule';
import { youtube_v3 } from 'googleapis';
import { useEffect, useState } from 'react';

const defaultThumbnail = {
  height: 270,
  width: 480,
  url: '/default_thumbnail.png',
};

export const useThumbnail = (
  type: ScheduleType,
  youTubeThumbnails?: youtube_v3.Schema$ThumbnailDetails,
  customThumbUrl?: string,
) => {
  const [thumbnail, setThumbnail] = useState<{
    height?: number | null;
    width?: number | null;
    url?: string | null;
  }>(defaultThumbnail);

  const getThumbnail = () => {
    if (customThumbUrl) {
      setThumbnail({
        height: 270,
        width: 480,
        url: customThumbUrl,
      });
    }
    if (youTubeThumbnails && type === ScheduleType.YouTube) {
      setThumbnail(
        youTubeThumbnails.medium ??
          youTubeThumbnails.standard ??
          youTubeThumbnails.high ??
          defaultThumbnail,
      );
    }
    if (type === ScheduleType.Twitcasting) {
      setThumbnail({
        height: 270,
        width: 480,
        url: '/default_twitcasting_thumbnail.png',
      });
    }
    if (type === ScheduleType.Niconico) {
      setThumbnail({
        height: 270,
        width: 480,
        url: '/default_niconico_thumbnail.png',
      });
    }
    if (type === ScheduleType.Twitch) {
      setThumbnail({
        height: 270,
        width: 480,
        url: '/default_twitch_thumbnail.png',
      });
    }
    if (type === ScheduleType.FC2) {
      setThumbnail({
        height: 270,
        width: 480,
        url: '/default_fc2_thumbnail.png',
      });
    }
    if (type === ScheduleType.TikTok) {
      setThumbnail({
        height: 270,
        width: 480,
        url: '/default_tiktok_thumbnail.png',
      });
    }
  };

  useEffect(() => {
    getThumbnail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    height: thumbnail.height ?? 270,
    width: thumbnail.width ?? 480,
    url: thumbnail.url ?? '/default_thumbnail.png',
  };
};
