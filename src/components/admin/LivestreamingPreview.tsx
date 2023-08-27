import { memo, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useVideoJs } from '@/hooks/videoJs';
import 'video.js/dist/video-js.css';
import { boxShadow, getVideoPlayerStyle } from '@/config/ui';
import { VideoJsPlayerOptions } from 'video.js';

const useStyles = makeStyles(() => ({
  previewContainer: {
    width: '100%',
    boxShadow: boxShadow.default,
    background: 'black',
    aspectRatio: '16 / 9',
    position: 'relative',
  },
  loadingPreview: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 100,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    background: 'black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '& p': {
      margin: '4px auto',
      width: '80%',
      color: 'white',
    },
  },
  vjs: {
    ...getVideoPlayerStyle(),
    '& .vjs-big-play-centered .vjs-big-play-button': {
      top: 0,
      left: 0,
      marginTop: 0,
      marginLeft: 0,
      height: '100%',
      width: '100%',
      border: 'none',
      borderRadius: 0,
      background: '#00000050',
      fontSize: '6em',
      '&:hover': {
        background: '#00000040',
      },
    },
  },
  video: {
    width: '100%',
    height: '100%',
  },
}));

type Props = {
  srcUrl: string | undefined;
  isEnableToPlay: boolean;
  thumbnailUrl: string;
  playerOptions: VideoJsPlayerOptions;
};

const LivestreamingPreview = memo<Props>(
  ({ srcUrl, isEnableToPlay, thumbnailUrl, playerOptions }) => {
    const classes = useStyles();
    const [isReadyToPlay, setIsReadyToPlay] = useState<boolean>();

    const playerRef = useRef<HTMLVideoElement>(null);

    const { player } = useVideoJs({
      videoElement: playerRef.current,
      thumbnailUrl: thumbnailUrl ?? '',
      playerOptions,
      isLive: true,
      srcUrl,
    });

    useEffect(() => {
      if (isEnableToPlay && player && player.player_ && srcUrl) {
        player.src(srcUrl);

        player.on('error', (e) => {
          console.log(e);
          setIsReadyToPlay(false);
          setTimeout(() => player.src(srcUrl), 5000);
        });

        player.on('loadeddata', () => {
          setIsReadyToPlay(true);
          player.play();
        });
      } else {
        setIsReadyToPlay(false);
      }
    }, [player, srcUrl, isEnableToPlay]);

    return (
      <div className={classes.previewContainer}>
        {!isReadyToPlay && (
          <div className={classes.loadingPreview}>
            <p>ストリーミング ソフトウェアに接続してプレビューを開始します</p>
            <p>
              ライブ配信を開始すると、視聴者はライブ配信を見つけられるようになります
            </p>
          </div>
        )}
        <div className={classes.vjs}>
          <div data-vjs-player>
            <video
              ref={playerRef}
              className={clsx(
                classes.video,
                'video-js vjs-16-9 vjs-big-play-centered',
              )}
              playsInline
            />
          </div>
        </div>
      </div>
    );
  },
);

export default LivestreamingPreview;
