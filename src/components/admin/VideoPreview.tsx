import { memo, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHlsJs } from '@/hooks/hlsJs';
import VideoController from '@/containers/video/VideoController';
import { useCookies } from 'react-cookie';
import { checkBoolString } from '@/libs/utils/cookie';

const useStyles = makeStyles(() => ({
  previewContainer: {
    width: '100%',
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
  video: {
    width: '100%',
    height: '100%',
  },
}));

type Props = {
  srcUrl: string | undefined;
  isEnableToPlay: boolean;
  thumbnailUrl: string | undefined;
  uploadProgress: number;
  isTranscoding: boolean;
};

const VideoPreview = memo<Props>(
  ({ srcUrl, isEnableToPlay, thumbnailUrl, uploadProgress, isTranscoding }) => {
    const classes = useStyles();
    const playerRef = useRef<HTMLVideoElement>(null);
    const playerParentRef = useRef<HTMLDivElement>(null);
    const [cookie] = useCookies();

    const isUploading =
      uploadProgress !== undefined &&
      uploadProgress !== 0 &&
      uploadProgress !== 100;

    const isProcessing = isUploading || isTranscoding;
    const videoElement = playerRef.current;

    const { qualities, currentQuality, setQuality } = useHlsJs({
      videoElement,
      srcUrl: srcUrl ?? '',
      isEnableToPlay: isEnableToPlay && srcUrl !== '',
      isLive: false,
    });

    return (
      <div className={classes.previewContainer}>
        {isProcessing && (
          <div className={classes.loadingPreview}>
            {(isUploading || isTranscoding) && (
              <CircularProgress
                color="secondary"
                size={32}
                style={{ marginBottom: '12px' }}
              />
            )}
            <div style={{ textAlign: 'center', width: '100%' }}>
              {isUploading ? (
                <>
                  <p>動画をアップロード中です...</p>
                  <p>{uploadProgress && `${uploadProgress}%/100%`}</p>
                </>
              ) : isTranscoding ? (
                <p>動画をトランスコード中です...</p>
              ) : (
                <p>
                  {srcUrl === undefined && '動画をアップロードしてください'}
                </p>
              )}
            </div>
          </div>
        )}
        {!isProcessing && (
          <div ref={playerParentRef}>
            <video
              ref={playerRef}
              className={clsx(classes.video)}
              poster={thumbnailUrl}
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
              hasBorderRadius={false}
            />
          </div>
        )}
      </div>
    );
  },
);

export default VideoPreview;
