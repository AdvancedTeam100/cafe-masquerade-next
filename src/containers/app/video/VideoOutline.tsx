import { useWindowDimensions } from '@/hooks/windowDimensions';
import { Grid, useMediaQuery } from '@material-ui/core';
import * as React from 'react';
import { Video } from '@/libs/models/video';
import { UserRole } from '@/libs/models/user';
import { useDispatch, useSelector } from 'react-redux';
import { videoSelectors } from '@/store/app/video';
import { useAuth } from '@/hooks/auth';
import { ThunkDispatch } from '@/store';
import {
  livestreamingOperations,
  livestreamingSelectors,
} from '@/store/app/livestreaming';
import LivestreamingSmTab from '../livestreaming/LivestreamingSmTab';
import LivestreamingRoleRequiredModal from '../livestreaming/LivestreamingRoleRequiredModal';
import useOutlineStyles from '../common/useOutlineStyle';
import LivestreamingAuthRequiredModal from '../livestreaming/LivestreamingAuthRequiredModal';
import LivestreamingChatReplay from '../livestreaming/LivestreamingChatReplay';
import HlsVideoPlayer from './HlsVideoPlayer';
import VideoDisabledExpiredModal from './VideoDisabledExpiredModal';
import VideoInfoComponent from './VideoInfo';

type Props = {
  video: Video;
  srcUrl: string;
};

const VideoOutline: React.FC<Props> = ({ video, srcUrl }) => {
  const isSm = useMediaQuery('(max-width: 960px)');
  const { isEnabledExpired, isEnabledRole } = useSelector(
    videoSelectors.archive,
  );
  const { isInitialized, user } = useAuth();
  const { livestreaming } = useSelector(livestreamingSelectors.state);
  const dispatch = useDispatch<ThunkDispatch>();

  React.useEffect(() => {
    if (video.wasLivestreaming) {
      dispatch(livestreamingOperations.get(video.id));
    }
  }, [video, user, isInitialized, dispatch]);

  const playerContainerRef = React.createRef<HTMLDivElement>();
  const { height, width } = useWindowDimensions();
  const [playerHeight, setPlayerHeight] = React.useState(0);
  React.useEffect(() => {
    if (playerContainerRef.current) {
      setPlayerHeight(playerContainerRef.current.clientHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, width, video]);

  const classes = useOutlineStyles({
    playerHeight,
    windowHeight: height,
    isVertical: height > width,
    wasLivestreaming: video.wasLivestreaming,
  });

  return (
    <>
      {video && video.uploadStatus === 'Transcoded' && (
        <Grid container className={classes.container}>
          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            lg={8}
            className={classes.mainContainer}
          >
            <div className={classes.playerContainer} ref={playerContainerRef}>
              <HlsVideoPlayer
                video={video}
                srcUrl={srcUrl}
                isAuthenticated={
                  isEnabledRole && isEnabledExpired ? true : false
                }
              />
            </div>
            {isSm && height > width && <div className={classes.playerSpacer} />}
            <div className={classes.bottomWrapper}>
              <div className={classes.bottomContainer}>
                {isSm ? (
                  <LivestreamingSmTab
                    infoComponent={
                      <div className={classes.infoContainer}>
                        <VideoInfoComponent video={video} />
                      </div>
                    }
                    chatComponent={
                      <div className={classes.chatContainer}>
                        <LivestreamingChatReplay
                          livestreamingId={video.id}
                          wasLivestreaming={video.wasLivestreaming}
                          startAt={
                            livestreaming?.startRecordAt
                              ? new Date(livestreaming.startRecordAt).getTime()
                              : null
                          }
                        />
                      </div>
                    }
                  />
                ) : (
                  <div className={classes.infoContainer}>
                    <VideoInfoComponent video={video} />
                  </div>
                )}
              </div>
            </div>
          </Grid>
          {!isSm && (
            <Grid item md={4} lg={4} className={classes.sideContainer}>
              <div className={classes.chatContainer}>
                <LivestreamingChatReplay
                  livestreamingId={video.id}
                  wasLivestreaming={video.wasLivestreaming}
                  startAt={
                    livestreaming?.startRecordAt
                      ? new Date(livestreaming.startRecordAt).getTime()
                      : null
                  }
                />
              </div>
            </Grid>
          )}
        </Grid>
      )}
      {video.requiredRole !== 'nonUser' && isInitialized && !user && (
        <LivestreamingAuthRequiredModal />
      )}
      {isEnabledRole !== null &&
        user &&
        !(isEnabledRole && isEnabledExpired) &&
        !isEnabledRole && (
          <LivestreamingRoleRequiredModal
            requiredRole={video.requiredRole as UserRole}
          />
        )}
      {isEnabledRole !== null &&
        user &&
        !(isEnabledRole && isEnabledExpired) &&
        isEnabledRole &&
        !isEnabledExpired && (
          <VideoDisabledExpiredModal
            expiredAt={video.expiredAt?.[user.role as UserRole] ?? ''}
          />
        )}
    </>
  );
};

export default VideoOutline;
