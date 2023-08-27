/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import VideoQualitySelector from '@/containers/video/VideoQualitySelector';
import jaLocale from '../locale/ja/video.json'; // 'video.js/dist/lang/ja.json'

type Representation = {
  id: string;
  bandwidth: number;
  enabled: (enable: boolean) => void;
  height: number;
  width: number;
  codecs: {
    audio: string;
    video: string;
  };
  playlist: {
    attributes: {
      'AVERAGE-BANDWIDTH': string;
      BANDWIDTH: string;
      CODECS: string;
      RESOLUTION: { height: number; width: number };
    };
    uri: string;
    timeline: number;
    id: string;
    resolvedUri: string;
  };
};

interface Tech extends videojs.Tech {
  vhs?: {
    representations: () => Representation[];
  };
}

declare module 'video.js' {
  interface VideoJsPlayer {
    isDisposed_: boolean;
    tech(safety?: any): Tech;
  }
}

export const useVideoJs = ({
  videoElement,
  thumbnailUrl,
  playerOptions = {
    muted: true,
    autoplay: true,
  },
  isLive = false,
  srcUrl,
}: {
  videoElement: HTMLVideoElement | null;
  thumbnailUrl: string;
  playerOptions?: VideoJsPlayerOptions;
  isLive?: boolean;
  srcUrl?: string | null;
}) => {
  const [player, setPlayer] = useState<VideoJsPlayer | null>(null);
  const [poster, setPoster] = useState(thumbnailUrl);
  const options: VideoJsPlayerOptions = {
    controls: true,
    language: 'ja',
    poster,
    liveui: false,
    inactivityTimeout: 500,
    html5: {
      vhs: {
        withCredentials: isLive
          ? false
          : srcUrl && srcUrl.includes('https://video.cafe-masquerade.com'),
        overrideNative: true,
      },
      nativeVideoTracks: false,
      nativeAudioTracks: false,
      nativeTextTracks: false,
    },
    ...playerOptions,
  };

  useEffect(() => {
    videojs
      .getComponent('Component')
      .registerComponent('VideoQualitySelector', VideoQualitySelector);

    if (videoElement) {
      videojs.addLanguage('ja', jaLocale);
      const player = videojs(videoElement, options, () => {
        player.errorDisplay.removeClass('vjs-error-display');
      });
      player.getChild('controlBar')?.addChild('VideoQualitySelector', {});

      setPlayer(player);
      return () => {
        player.dispose();
      };
    }
  }, [videoElement, srcUrl]);

  useEffect(() => {
    setPoster(thumbnailUrl);
  }, [thumbnailUrl]);

  useEffect(() => {
    if (player && player.player_) {
      player.poster(poster);
    }
  }, [poster]);

  return { player };
};
