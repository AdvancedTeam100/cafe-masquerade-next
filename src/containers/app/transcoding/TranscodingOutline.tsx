import { useWindowDimensions } from '@/hooks/windowDimensions';
import {
  Grid,
  Paper,
  Theme,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import * as React from 'react';
import { Video } from '@/libs/models/video';
import { UserRole } from '@/libs/models/user';
import { useSelector } from 'react-redux';
import { videoSelectors } from '@/store/app/video';
import { authSelectors } from '@/store/auth';
import { Livestreaming } from '@/libs/models/livestreaming';
import { ErrorOutline } from '@material-ui/icons';
import { boxShadow, colors, getVideoPlayerStyle } from '@/config/ui';
import clsx from 'clsx';
import SectionTitle from '@/components/app/common/SectionTitle';
import TextContent from '@/components/app/common/TextContent';
import LivestreamingInfoComponent from '../livestreaming/LivestreamingInfo';
import useOutlineStyles from '../common/useOutlineStyle';
import LivestreamingRoleRequiredModal from '../livestreaming/LivestreamingRoleRequiredModal';
import LivestreamingSmTab from '../livestreaming/LivestreamingSmTab';
import VideoDisabledExpiredModal from '../video/VideoDisabledExpiredModal';
import VideoInfoComponent from './TranscodingInfo';

const borderRadiusProp = (theme: Theme) => ({
  [theme.breakpoints.up('md')]: {
    borderRadius: '12px !important',
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: '0px',
  },
});

const useStyles = makeStyles((theme) => ({
  preparingArchive: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    textAlign: 'center',
    fontSize: '16px',
    '& svg': {
      fontSize: '3em',
      margin: '0 4px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      '& p': {
        fontSize: '14px',
        textAlign: 'left',
      },
    },
  },
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
  innerChat: {
    height: 'auto',
    borderRadius: '12px',
    padding: theme.spacing(2, 0),
    [theme.breakpoints.down('sm')]: {
      borderRadius: (isPopup) => !isPopup && '0 0 12px 12px',
      padding: (isPopup) => !isPopup && theme.spacing(0),
    },
  },
  preparingChat: {
    textAlign: 'center',
    color: colors.brownText,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: 'auto',
  },
  chatContainer: {
    boxShadow: boxShadow.default,
    borderRadius: '12px',
    zIndex: 100,
    height: 'auto',
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
    ...getVideoPlayerStyle(),
  },
}));

type Props = {
  video: Video | null;
  livestreaming: Livestreaming;
};

const TranscodingOutline: React.FC<Props> = ({ video, livestreaming }) => {
  const isSm = useMediaQuery('(max-width: 960px)');
  const { user } = useSelector(authSelectors.state);
  const { isEnabledRole, isEnabledExpired } = useSelector(
    videoSelectors.archive,
  );

  const playerContainerRef = React.createRef<HTMLDivElement>();
  const { height, width } = useWindowDimensions();
  const [playerHeight, setPlayerHeight] = React.useState(0);
  React.useEffect(() => {
    if (playerContainerRef.current) {
      setPlayerHeight(playerContainerRef.current.clientHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, width]);

  const [isTranscoding, setIsTranscoding] = React.useState(false);
  React.useEffect(() => {
    if (!livestreaming || livestreaming.status !== 'Finished') return;

    if (video) {
      setIsTranscoding(video.uploadStatus === 'RequestedTranscode');
    } else {
      setIsTranscoding(livestreaming.recordStatus !== 'Transcoded');
    }
  }, [livestreaming, video]);

  const classes = useOutlineStyles({
    playerHeight,
    windowHeight: height,
    isVertical: height > width,
  });
  const originalClasses = useStyles();

  return (
    <>
      {isTranscoding && (
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
              <div className={originalClasses.container}>
                <div
                  className={clsx(originalClasses.content, originalClasses.vjs)}
                >
                  <div className={originalClasses.preparingArchive}>
                    <ErrorOutline color="inherit" fontSize="large" />
                    <p>
                      現在お給仕をアーカイブ化しています。
                      {isSm && <br />}
                      しばらくお待ちください。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {isSm && height > width && <div className={classes.playerSpacer} />}
            <div className={classes.bottomWrapper}>
              <div className={classes.bottomContainer}>
                {isSm ? (
                  <LivestreamingSmTab
                    infoComponent={
                      <div className={classes.infoContainer}>
                        {video ? (
                          <VideoInfoComponent video={video} />
                        ) : (
                          <LivestreamingInfoComponent
                            livestreaming={livestreaming}
                          />
                        )}
                      </div>
                    }
                    chatComponent={
                      <div className={originalClasses.chatContainer}>
                        <Paper
                          className={originalClasses.innerChat}
                          elevation={0}
                        >
                          <SectionTitle
                            title="おはなしのリプレイ"
                            subTitle="Chat replay"
                          />
                          <TextContent>
                            <p className={originalClasses.preparingChat}>
                              現在おはなしのリプレイを作成中です. . .
                            </p>
                          </TextContent>
                        </Paper>
                      </div>
                    }
                  />
                ) : (
                  <div className={classes.infoContainer}>
                    {video ? (
                      <VideoInfoComponent video={video} />
                    ) : (
                      <LivestreamingInfoComponent
                        livestreaming={livestreaming}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </Grid>
          <Grid item md={4} lg={4} className={classes.sideContainer}>
            <div className={originalClasses.chatContainer}>
              <Paper className={originalClasses.innerChat} elevation={0}>
                <SectionTitle
                  title="おはなしのリプレイ"
                  subTitle="Chat replay"
                />
                <TextContent>
                  <p className={originalClasses.preparingChat}>
                    現在おはなしのリプレイを作成中です. . .
                  </p>
                </TextContent>
              </Paper>
            </div>
          </Grid>
          {isEnabledRole !== null &&
            !(isEnabledRole && isEnabledExpired) &&
            !isEnabledRole &&
            (video ? (
              <LivestreamingRoleRequiredModal
                requiredRole={video.requiredRole as UserRole}
              />
            ) : (
              <LivestreamingRoleRequiredModal
                requiredRole={livestreaming.requiredRole as UserRole}
              />
            ))}
          {isEnabledRole !== null &&
            user &&
            !(isEnabledRole && isEnabledExpired) &&
            livestreaming.videoConfig &&
            !isEnabledExpired &&
            (video ? (
              <VideoDisabledExpiredModal
                expiredAt={video.expiredAt?.[user.role as UserRole] ?? ''}
              />
            ) : (
              <VideoDisabledExpiredModal
                expiredAt={
                  livestreaming.videoConfig.expiredAt?.[
                    user.role as UserRole
                  ] ?? ''
                }
              />
            ))}
        </Grid>
      )}
    </>
  );
};

export default TranscodingOutline;
