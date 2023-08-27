import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { Theme, makeStyles } from '@material-ui/core/styles';
import {
  Livestreaming,
  LivestreamingStatus,
} from '@/libs/models/livestreaming';
import { boxShadow, getVideoPlayerStyle } from '@/config/ui';
import { useVideoJs } from '@/hooks/videoJs';
import 'video.js/dist/video-js.css';

const borderRadiusProp = (theme: Theme) => ({
  [theme.breakpoints.up('md')]: {
    borderRadius: '12px !important',
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: '0px',
  },
});

const useStyles = makeStyles((theme) => ({
  container: {
    ...borderRadiusProp(theme),
    width: '100%',
    boxShadow: boxShadow.default,
    background: 'black',
    aspectRatio: '16 / 9',
    position: 'relative',
    '&:before': {
      content: '""',
      display: 'block',
      paddingTop: '56.25%',
    },
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  thumbnail: {
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
    ...borderRadiusProp(theme),
  },
  vjs: {
    '& .vjs-tech': {
      ...borderRadiusProp(theme),
    },
    '& .vjs-poster': {
      ...borderRadiusProp(theme),
    },
    '& .vjs-modal-dialog': {
      ...borderRadiusProp(theme),
    },
    '& .vjs-control-bar': {
      [theme.breakpoints.up('md')]: {
        borderRadius: '0 0 12px 12px !important',
      },
      [theme.breakpoints.down('sm')]: {
        borderRadius: '0px',
      },
    },
    ...getVideoPlayerStyle({ volumeLeftSP: '60px' }),
  },
  video: {
    width: '100%',
    height: '100%',
    ...borderRadiusProp(theme),
  },
  preparingArchive: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    textAlign: 'center',
    fontSize: '16px',
  },
}));

type Props = {
  livestreaming: Livestreaming;
  srcUrl: string;
  isAuthenticated: boolean | null;
};

const LivestreamingPlayer: React.FC<Props> = ({
  livestreaming,
  srcUrl,
  isAuthenticated,
}) => {
  const classes = useStyles();
  const playerRef = useRef<HTMLVideoElement>(null);
  const { player } = useVideoJs({
    videoElement: playerRef.current,
    thumbnailUrl: livestreaming.thumbnailUrl,
    playerOptions: {
      muted: false,
      autoplay: true,
      controlBar: {
        currentTimeDisplay: false,
        timeDivider: false,
        durationDisplay: false,
      },
    },
    isLive: true,
  });
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !player) return;
    switch (livestreaming.status) {
      case LivestreamingStatus.Streaming:
        if (srcUrl === '') break;
        if (player.player_) {
          player.src(srcUrl);
          player.play();
        } else if (player.isDisposed_) {
          router.reload();
        }
        break;
      case LivestreamingStatus.Finished:
        if (!player.player_) break;
        if (player.isFullscreen()) {
          player.exitFullscreen();
        }
        player.pause();
        player.src('');
        player.dispose();
    }
  }, [livestreaming.status, player, srcUrl, isAuthenticated, router]);

  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  return (
    <div className={classes.container}>
      <div className={clsx(classes.content, classes.vjs)}>
        {(!isAuthenticated ||
          new Date(livestreaming.publishedAt) > new Date() ||
          (livestreaming.status === 'Finished' &&
            !livestreaming.shouldStartRecording)) && (
          <img
            className={classes.thumbnail}
            src={livestreaming.thumbnailUrl}
            alt={livestreaming.title}
          />
        )}
        {isAuthenticated && livestreaming.status !== 'Finished' && (
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
        )}
        {isAuthenticated &&
          livestreaming.status === 'Finished' &&
          livestreaming.recordStatus === 'Transcoded' && (
            <div data-vjs-player>
              <video
                ref={videoPlayerRef}
                className={clsx(
                  classes.video,
                  'video-js vjs-16-9 vjs-big-play-centered',
                )}
                playsInline
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default LivestreamingPlayer;
