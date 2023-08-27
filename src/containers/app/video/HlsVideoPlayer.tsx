import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { boxShadow } from '@/config/ui';
import { Video } from '@/libs/models/video';
import { ThunkDispatch } from '@/store';
import { livestreamingChatReplayOperations } from '@/store/app/livestreamingChatReplay';
import { routerSelectors } from '@/store/router';
import { useHlsJs } from '@/hooks/hlsJs';
import VideoController from '@/containers/video/VideoController';
import { useCookies } from 'react-cookie';
import { checkBoolString } from '@/libs/utils/cookie';

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
  video: Video;
  srcUrl: string;
  isAuthenticated: boolean;
};

const VideoPlayer: React.FC<Props> = ({ video, srcUrl, isAuthenticated }) => {
  const classes = useStyles();
  const dispatch = useDispatch<ThunkDispatch>();
  const playerRef = useRef<HTMLVideoElement>(null);
  const playerParentRef = useRef<HTMLDivElement>(null);
  const videoElement = playerRef.current;
  const [cookie] = useCookies();
  const { qualities, currentQuality, setQuality } = useHlsJs({
    videoElement,
    srcUrl,
    isEnableToPlay: isAuthenticated && srcUrl !== '',
    isLive: false,
  });

  useEffect(() => {
    if (!isAuthenticated || srcUrl === '' || !videoElement) {
      return;
    }

    videoElement.addEventListener('timeupdate', () => {
      const currentTime = Math.floor(videoElement.currentTime * 1000);
      dispatch(
        livestreamingChatReplayOperations.updateCurrentTime(currentTime),
      );
    });
  }, [isAuthenticated, srcUrl, videoElement, dispatch]);

  return (
    <div className={classes.container}>
      <div className={clsx(classes.content)}>
        {(!isAuthenticated || new Date(video.publishedAt) > new Date()) && (
          <img
            className={classes.thumbnail}
            src={video.thumbnailUrl}
            alt={video.title}
          />
        )}
        {isAuthenticated && (
          <div ref={playerParentRef}>
            <video
              ref={playerRef}
              className={clsx(classes.video)}
              poster={video.thumbnailUrl}
              playsInline
            />
            <VideoController
              video={playerRef.current}
              qualities={qualities}
              currentQuality={currentQuality}
              setQuality={setQuality}
              parent={playerParentRef.current}
              autoplay={true}
              muted={checkBoolString(cookie['muted'])}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
