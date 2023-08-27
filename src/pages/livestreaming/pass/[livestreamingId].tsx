import React from 'react';
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import { Theme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  livestreamingCollection,
  livestreamingConverter,
  livestreamingDocument,
} from '@/libs/firebase/firestore/livestreaming';
import {
  livestreamingCredentialDocument,
  livestreamingInfoConverter,
} from '@/libs/firebase/firestore/livestreamingCredential';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import {
  LivestreamingStatus,
  checkUserRole,
} from '@/libs/models/livestreaming';
import { boxShadow } from '@/config/ui';
import LivestreamingSmTab from '@/containers/app/livestreaming/LivestreamingSmTab';
import LivestreamingPlayer from '@/containers/app/livestreaming/LivestreamingPlayer';
import LivestreamingInfoComponent from '@/containers/app/livestreaming/LivestreamingInfo';
import LivestreamingChat from '@/containers/app/livestreaming/LivestreamingChat';
import LivestreamingPasswordModal from '@/containers/app/livestreaming/LivestreamingPasswordModal';
import MetaHead from '@/components/common/Head';
import Wrapper from '@/components/app/templates/Wrapper';
import Header from '@/components/app/templates/Header';
import Footer from '@/components/app/templates/Footer';
import NotFound from '@/components/common/NotFound';
import { useWindowDimensions } from '@/hooks/windowDimensions';
import { useAuth } from '@/hooks/auth';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@/store';
import {
  livestreamingActions,
  livestreamingOperations,
  livestreamingSelectors,
} from '@/store/app/livestreaming';
import { useCookies } from 'react-cookie';

const HEADER_HEIGHT = 64;
const HEADER_HEIGHT_SM = 0;
const FOOTER_HEIGHT = 242;

const useStyles = makeStyles<
  Theme,
  {
    playerHeight: number;
    windowHeight: number;
    isVertical: boolean;
  }
>((theme) => ({
  loader: {
    margin: '64px auto',
    paddingTop: '32px',
    textAlign: 'center',
  },
  container: {
    maxWidth: '1800px',
    [theme.breakpoints.up('md')]: {
      margin: `${HEADER_HEIGHT}px auto 0`,
      padding: theme.spacing(2, 4),
      height: 'inherit',
      minHeight: `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)`,
    },
    [theme.breakpoints.down('sm')]: {
      margin: `${HEADER_HEIGHT_SM}px auto 0`,
      padding: theme.spacing(0),
      height: ({ isVertical, windowHeight }) =>
        isVertical
          ? `calc(${windowHeight}px - ${HEADER_HEIGHT_SM}px)`
          : 'inherit',
    },
  },
  mainContainer: {
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(0, 2),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0),
    },
  },
  playerContainer: {
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    [theme.breakpoints.up('md')]: {
      top: 0,
      height: 'inherit',
      positon: 'inherit',
    },
    [theme.breakpoints.down('sm')]: {
      top: `${HEADER_HEIGHT_SM}px`,
      height: 'calc(100vw * 9 / 16)',
      position: ({ isVertical }) => (isVertical ? 'fixed' : 'initial'),
    },
  },
  playerSpacer: {
    [theme.breakpoints.up('md')]: {
      paddingTop: '0',
    },
    [theme.breakpoints.down('sm')]: {
      paddingTop: 'calc(100vw * 9 / 16)',
    },
  },
  bottomWrapper: {
    left: 0,
    right: 0,
    bottom: 0,
    [theme.breakpoints.up('md')]: {
      top: 0,
      height: 'inherit',
      positon: 'inherit',
    },
    [theme.breakpoints.down('sm')]: {
      top: ({ isVertical }) => (isVertical ? 'calc((100vw * 9 / 16))' : 0),
      position: ({ isVertical }) => (isVertical ? 'fixed' : 'inherit'),
    },
  },
  bottomContainer: {
    borderRadius: '12px',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3, 0),
      height: 'inherit',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 0),
      height: ({ isVertical, windowHeight }) =>
        isVertical
          ? `calc(${windowHeight}px - (100vw * 9 / 16) - ${HEADER_HEIGHT_SM}px)`
          : 'inherit',
    },
  },
  infoContainer: {
    boxShadow: boxShadow.default,
    borderRadius: '12px',
  },
  sideContainer: {
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(0, 2),
      display: 'block',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0),
      display: 'none',
    },
  },
  chatContainer: {
    boxShadow: boxShadow.default,
    borderRadius: '12px',
    zIndex: 100,
    [theme.breakpoints.up('md')]: {
      height: ({ playerHeight }) => `${playerHeight}px`,
    },
    [theme.breakpoints.down('sm')]: {
      height: '100%',
    },
  },
}));

type Props = InferGetStaticPropsType<typeof getStaticProps>;

type Query = {
  livestreamingId: string;
};

export const getStaticPaths: GetStaticPaths<Query> = async () => {
  try {
    const [streamingQuerySnap, scheduledQuerySnap] = await Promise.all([
      await livestreamingCollection()
        .where('status', '==', LivestreamingStatus.Streaming)
        .get(),
      await livestreamingCollection()
        .where('status', '==', LivestreamingStatus.Scheduled)
        .get(),
    ]);
    const paths = [...streamingQuerySnap.docs, ...scheduledQuerySnap.docs].map(
      (doc) => {
        return {
          params: {
            livestreamingId: doc.id,
          },
        };
      },
    );

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (e) {
    console.log(e);
    return {
      paths: [],
      fallback: true,
    };
  }
};

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<Query>) => {
  if (params === undefined) {
    throw new Error('params is undefined');
  }

  try {
    const [livestreaming, homeContentSnap] = await Promise.all([
      await livestreamingDocument(params.livestreamingId)
        .withConverter(livestreamingConverter)
        .get(),
      await contentDocument('home').withConverter(homeConverter).get(),
    ]);
    return {
      props: {
        livestreaming: livestreaming.data() ?? null,
        homeContent: homeContentSnap?.data() ?? null,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.log(e);
    return {
      notFound: true,
      props: {
        homeContent: null,
        livestreaming: null,
      },
      revalidate: 1,
    };
  }
};

const LivestreamingId = ({
  livestreaming: initialLivestreaming,
  homeContent,
}: Props): JSX.Element => {
  const isSm = useMediaQuery('(max-width: 960px)');
  const { user, isFetching: isAuthFetching, isInitialized } = useAuth();
  const [cookies] = useCookies();
  const { info, livestreaming, hasAcceptedPass } = useSelector(
    livestreamingSelectors.state,
  );
  const { isAuthenticated } = useSelector(livestreamingSelectors.auth);
  const dispatch = useDispatch<ThunkDispatch>();

  React.useEffect(() => {
    if (initialLivestreaming) {
      dispatch(
        livestreamingActions.setLivestreaming({
          livestreaming: initialLivestreaming,
        }),
      );
    }

    if (livestreaming && isInitialized && cookies && !hasAcceptedPass) {
      dispatch(
        livestreamingOperations.checkPassword(
          livestreaming.id,
          cookies[livestreaming.id],
        ),
      );
    }
  }, [
    initialLivestreaming,
    livestreaming,
    isInitialized,
    cookies,
    hasAcceptedPass,
    dispatch,
  ]);

  React.useEffect(() => {
    if (livestreaming && isAuthenticated) {
      const unsubLS = livestreamingDocument(livestreaming.id)
        .withConverter(livestreamingConverter)
        .onSnapshot((doc) => {
          const livestreaming = doc.data() ?? null;
          if (livestreaming) {
            dispatch(livestreamingActions.setLivestreaming({ livestreaming }));
          }
        });

      if (
        user &&
        checkUserRole({
          requiredRole: livestreaming.requiredRole,
          userRole: user.role,
        })
      ) {
        const unsubLSCredential = livestreamingCredentialDocument(
          livestreaming.id,
          'info',
        )
          .withConverter(livestreamingInfoConverter)
          .onSnapshot((doc) => {
            const info = doc.data() ?? null;
            if (info) {
              dispatch(livestreamingActions.setLivestreamingInfo({ info }));
            }
          });

        return () => {
          unsubLSCredential();
          unsubLS();
        };
      }

      return () => unsubLS();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLivestreaming, isAuthenticated]);

  const playerContainerRef = React.createRef<HTMLDivElement>();
  const { height, width } = useWindowDimensions();
  const [playerHeight, setPlayerHeight] = React.useState(0);
  React.useEffect(() => {
    if (playerContainerRef.current) {
      setPlayerHeight(playerContainerRef.current.clientHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, width, isInitialized]);
  const classes = useStyles({
    playerHeight,
    windowHeight: height,
    isVertical: height > width,
  });

  return (
    <>
      <MetaHead
        title={`${livestreaming?.title} | ますかれーど`}
        description={livestreaming?.description ?? ''}
        keyword={''}
        image={livestreaming?.thumbnailUrl ?? ''}
        url={`/livestreaming/${livestreaming?.id}`}
        isNoIndex={true}
        upgradeInsecureRequests={false}
      />
      {!isSm && <Header onClickExpandIcon={() => console.log('')} />}
      <Wrapper
        headerHeight={HEADER_HEIGHT}
        headerHeightSm={HEADER_HEIGHT_SM}
        footerHeight={FOOTER_HEIGHT}
      >
        {isAuthFetching ? (
          <div className={classes.loader}>
            <CircularProgress color="secondary" />
          </div>
        ) : livestreaming ? (
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
                        <div className={classes.chatContainer}>
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
            <Grid item md={4} lg={4} className={classes.sideContainer}>
              <div className={classes.chatContainer}>
                <LivestreamingChat livestreaming={livestreaming} />
              </div>
            </Grid>
          </Grid>
        ) : (
          <NotFound />
        )}
      </Wrapper>
      {!isSm && <Footer additionalLinks={homeContent?.sideLinks ?? []} />}
      {!isAuthenticated && livestreaming && !isAuthFetching && (
        <LivestreamingPasswordModal livestreamingId={livestreaming.id} />
      )}
    </>
  );
};

export default LivestreamingId;
