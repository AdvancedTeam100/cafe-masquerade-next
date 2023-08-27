/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Hls from 'hls.js';

export type Quality = number | 'auto';

export const useHlsJs = ({
  videoElement,
  srcUrl,
  isEnableToPlay,
  isLive,
}: {
  videoElement: HTMLVideoElement | null;
  srcUrl: string;
  isEnableToPlay: boolean;
  isLive: boolean;
}) => {
  const [player, setPlayer] = useState<Hls>();
  const [qualities, setQualities] = useState<Quality[]>(['auto']);
  const [currentQuality, setCurrentQuality] = useState<number | 'auto'>('auto');

  useEffect(() => {
    if (!Hls.isSupported()) return;

    setPlayer(
      new Hls({
        // debug: process.env.NODE_ENV === 'development',
        defaultAudioCodec: 'mp4a.40.2',
        maxAudioFramesDrift: 15,
        xhrSetup: (xhr) => {
          xhr.withCredentials = isLive
            ? false
            : srcUrl.includes('https://video.cafe-masquerade.com');
        },
      }),
    );
  }, [srcUrl]);

  useEffect(() => {
    if (!videoElement || !isEnableToPlay || !srcUrl) return;

    if (
      !Hls.isSupported() &&
      videoElement.canPlayType('application/vnd.apple.mpegurl')
    ) {
      videoElement.src = srcUrl;
      videoElement.load();
    }

    if (!player) return;

    player.attachMedia(videoElement);

    player.on(Hls.Events.MEDIA_ATTACHED, () => {
      player.loadSource(srcUrl);

      player.on(Hls.Events.MANIFEST_PARSED, () => {
        initQuality(player);
      });
    });

    player.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            player.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            player.recoverMediaError();
            break;
          default:
            player.destroy();
            break;
        }
      }
    });
  }, [videoElement, player, srcUrl, isEnableToPlay]);

  const initQuality = (player: Hls) => {
    if (qualities.length > 1) return;
    const availableQualities = player.levels.map((level) => level.height);
    availableQualities.sort((a, b) => b - a);
    setQualities([...availableQualities, 'auto']);
    setCurrentQuality(player.levels[player.currentLevel]?.height ?? 'auto');
  };

  const setQuality = (quality: Quality) => {
    if (!player) return;
    const index = player.levels.findIndex((level) => level.height === quality);
    player.currentLevel = index;
    setCurrentQuality(quality);
  };

  return { player, qualities, currentQuality, setQuality };
};
