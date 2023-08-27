import React from 'react';
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  livestreamingCollection,
  livestreamingConverter,
  livestreamingDocument,
} from '@/libs/firebase/firestore/livestreaming';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import { LivestreamingStatus } from '@/libs/models/livestreaming';
import MetaHead from '@/components/common/Head';
import Wrapper from '@/components/app/templates/Wrapper';
import Header from '@/components/app/templates/Header';
import Footer from '@/components/app/templates/Footer';
import NotFound from '@/components/common/NotFound';
import LivestreamingOutline from '@/containers/app/livestreaming/LivestreamingOutline';
import VideoOutline from '@/containers/app/video/VideoOutline';
import TranscodingOutline from '@/containers/app/transcoding/TranscodingOutline';
import { videoConverter, videoDocument } from '@/libs/firebase/firestore/video';
import { useAuth } from '@/hooks/auth';
import { useDispatch, useSelector } from 'react-redux';
import {
  livestreamingActions,
  livestreamingSelectors,
} from '@/store/app/livestreaming';
import { ThunkDispatch } from '@/store';
import { videoActions, videoSelectors } from '@/store/app/video';
import { useVideoAuthorization } from '@/hooks/videoAuthorization';

const HEADER_HEIGHT = 64;
const HEADER_HEIGHT_SM = 0;
const FOOTER_HEIGHT = 242;

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
  const livestreamingId = params.livestreamingId;

  try {
    const [livestreaming, homeContentSnap] = await Promise.all([
      await livestreamingDocument(livestreamingId)
        .withConverter(livestreamingConverter)
        .get(),
      await contentDocument('home').withConverter(homeConverter).get(),
    ]);
    return {
      props: {
        livestreaming: livestreaming.data() ?? null,
        homeContent: homeContentSnap?.data() ?? null,
        livestreamingId,
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
        video: null,
        livestreamingId: null,
      },
      revalidate: 1,
    };
  }
};

const LivestreamingId = ({
  livestreaming: initialLivestreaming,
  homeContent,
  livestreamingId,
}: Props): JSX.Element => {
  const isSm = useMediaQuery('(max-width: 960px)');
  const dispatch = useDispatch<ThunkDispatch>();

  const { isInitialized, user } = useAuth();
  const { targetVideo } = useSelector(videoSelectors.archive);
  const { livestreaming } = useSelector(livestreamingSelectors.state);
  const { srcUrl } = useVideoAuthorization(livestreamingId);

  React.useEffect(() => {
    if (!isInitialized || !livestreamingId) return;

    const unsub = livestreamingDocument(livestreamingId)
      .withConverter(livestreamingConverter)
      .onSnapshot((doc) => {
        const livestreaming = doc.data();
        if (livestreaming) {
          dispatch(livestreamingActions.setLivestreaming({ livestreaming }));
        }
      });

    return () => unsub();
  }, [isInitialized, livestreamingId, user, dispatch]);

  React.useEffect(() => {
    if (!livestreamingId) return;
    if (livestreaming && livestreaming.status !== 'Finished') return;

    dispatch(videoActions.setTargetVideoId({ targetVideoId: livestreamingId }));

    const unsub = videoDocument(livestreamingId)
      .withConverter(videoConverter)
      .onSnapshot((doc) => {
        const video = doc.data();
        if (video) {
          dispatch(videoActions.setVideo({ video }));
        }
      });

    return () => unsub();
  }, [isInitialized, livestreaming, livestreamingId, user, dispatch]);

  return (
    <>
      <MetaHead
        title={`${initialLivestreaming?.title} | ますかれーど`}
        description={initialLivestreaming?.description ?? ''}
        keyword={''}
        image={initialLivestreaming?.thumbnailUrl ?? ''}
        url={`/livestreaming/${initialLivestreaming?.id}`}
        isNoIndex={true}
        upgradeInsecureRequests={false}
      />
      {!isSm && <Header onClickExpandIcon={() => console.log('')} />}
      <Wrapper
        headerHeight={HEADER_HEIGHT}
        headerHeightSm={HEADER_HEIGHT_SM}
        footerHeight={FOOTER_HEIGHT}
      >
        {livestreaming && (
          <>
            {livestreaming.status !== 'Finished' ||
            !livestreaming.shouldStartRecording ? (
              <LivestreamingOutline livestreaming={livestreaming} />
            ) : (
              <TranscodingOutline
                livestreaming={livestreaming}
                video={targetVideo}
              />
            )}
          </>
        )}
        {targetVideo && <VideoOutline video={targetVideo} srcUrl={srcUrl} />}

        {!initialLivestreaming && <NotFound />}
      </Wrapper>
      {!isSm && <Footer additionalLinks={homeContent?.sideLinks ?? []} />}
    </>
  );
};

export default LivestreamingId;
