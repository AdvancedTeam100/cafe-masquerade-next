import { boxShadow } from '@/config/ui';
import { useAuth } from '@/hooks/auth';
import { useWindowDimensions } from '@/hooks/windowDimensions';
import { Livestreaming } from '@/libs/models/livestreaming';
import { Grid, Theme, makeStyles, useMediaQuery } from '@material-ui/core';
import * as React from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  livestreamingOperations,
  livestreamingSelectors,
} from '@/store/app/livestreaming';
import { ThunkDispatch } from '@/store';
import useOutlineStyles from '../common/useOutlineStyle';
import LivestreamingChat from './LivestreamingChat';
import LivestreamingPlayer from './LivestreamingPlayer';
import LivestreamingSmTab from './LivestreamingSmTab';
import LivestreamingInfoComponent from './LivestreamingInfo';
import LivestreamingRoleRequiredModal from './LivestreamingRoleRequiredModal';
import LivestreamingAuthRequiredModal from './LivestreamingAuthRequiredModal';

const useBaseStyle = makeStyles<
  Theme,
  {
    isPreparingChat: boolean;
    playerHeight: number;
  }
>((theme) => ({
  chatContainer: {
    boxShadow: boxShadow.default,
    borderRadius: '12px',
    zIndex: 100,
    [theme.breakpoints.up('md')]: {
      height: ({ playerHeight, isPreparingChat }) =>
        !isPreparingChat ? `${playerHeight}px` : 'auto',
    },
    [theme.breakpoints.down('sm')]: {
      height: '100%',
    },
  },
}));

type Props = {
  livestreaming: Livestreaming;
};

const LivestreamingOutline: React.FC<Props> = ({ livestreaming }) => {
  const isSm = useMediaQuery('(max-width: 960px)');
  const dispatch = useDispatch<ThunkDispatch>();
  const { user, isInitialized } = useAuth();
  const { info } = useSelector(livestreamingSelectors.state);
  const { isPreparingChat } = useSelector(livestreamingSelectors.chat);
  const { isAuthenticated } = useSelector(livestreamingSelectors.auth);

  React.useEffect(() => {
    if (!isInitialized && !user) return;

    isAuthenticated && dispatch(livestreamingOperations.getInfo());
  }, [livestreaming, isInitialized, user, isAuthenticated, dispatch]);

  const playerContainerRef = React.createRef<HTMLDivElement>();
  const { height, width } = useWindowDimensions();
  const [playerHeight, setPlayerHeight] = React.useState(0);
  React.useEffect(() => {
    if (playerContainerRef.current) {
      setPlayerHeight(playerContainerRef.current.clientHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, width]);

  const theaterClasses = useBaseStyle({
    playerHeight,
    isPreparingChat,
  });
  const classes = useOutlineStyles({
    playerHeight,
    windowHeight: height,
    isVertical: height > width,
  });
  return (
    <>
      {livestreaming &&
        (livestreaming.status !== 'Finished' ||
          livestreaming.recordStatus !== 'Transcoded') && (
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
                <LivestreamingPlayer
                  livestreaming={livestreaming}
                  srcUrl={info?.encodedUrl ?? ''}
                  isAuthenticated={isAuthenticated}
                />
              </div>
              {isSm && height > width && (
                <div className={classes.playerSpacer} />
              )}
              <div className={classes.bottomWrapper}>
                <div className={classes.bottomContainer}>
                  {isSm ? (
                    <LivestreamingSmTab
                      infoComponent={
                        <div className={classes.infoContainer}>
                          <LivestreamingInfoComponent
                            livestreaming={livestreaming}
                          />
                        </div>
                      }
                      chatComponent={
                        <div
                          className={clsx(
                            classes.chatContainer,
                            theaterClasses.chatContainer,
                          )}
                        >
                          <LivestreamingChat livestreaming={livestreaming} />
                        </div>
                      }
                    />
                  ) : (
                    <div className={classes.infoContainer}>
                      <LivestreamingInfoComponent
                        livestreaming={livestreaming}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Grid>
            {!isSm && (
              <Grid item md={4} lg={4} className={classes.sideContainer}>
                <div
                  className={clsx(
                    classes.chatContainer,
                    theaterClasses.chatContainer,
                  )}
                >
                  <LivestreamingChat livestreaming={livestreaming} />
                </div>
              </Grid>
            )}
          </Grid>
        )}
      {isInitialized &&
        user &&
        !isAuthenticated &&
        livestreaming &&
        livestreaming.status !== 'Finished' && (
          <LivestreamingRoleRequiredModal
            requiredRole={livestreaming.requiredRole}
          />
        )}
      {isInitialized && !user && <LivestreamingAuthRequiredModal />}
    </>
  );
};

export default LivestreamingOutline;
