import React from 'react';
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import MetaHead from '@/components/common/Head';
import Wrapper from '@/components/app/templates/Wrapper';
import Header from '@/components/app/templates/Header';
import Footer from '@/components/app/templates/Footer';
import NotFound from '@/components/common/NotFound';
import VideoOutline from '@/containers/app/video/VideoOutline';
import {
  videoCollection,
  videoConverter,
  videoDocument,
} from '@/libs/firebase/firestore/video';
import { useAuth } from '@/hooks/auth';
import {
  VideoStatus,
  VideoUploadStatus,
  isEnablePublic,
} from '@/libs/models/video';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@/store';
import { videoActions, videoSelectors } from '@/store/app/video';
import TranscodingOutline from '@/containers/app/transcoding/TranscodingOutline';
import { livestreamingSelectors } from '@/store/app/livestreaming';
import { useVideoAuthorization } from '@/hooks/videoAuthorization';

const HEADER_HEIGHT = 64;
const HEADER_HEIGHT_SM = 0;
const FOOTER_HEIGHT = 242;

type Props = InferGetStaticPropsType<typeof getStaticProps>;

type Query = {
  videoId: string;
};

export const getStaticPaths: GetStaticPaths<Query> = async () => {
  try {
    const videoQuerySnap = await videoCollection()
      .where('status', 'in', [VideoStatus.Limited, VideoStatus.Published])
      .where('publishedAt', '<', new Date())
      .get();
    const paths = videoQuerySnap.docs.map((doc) => {
      return {
        params: {
          videoId: doc.id,
        },
      };
    });

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (e) {
    console.log(e);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<Query>) => {
  if (params === undefined) {
    throw new Error('params is undefined');
  }
  const videoId = params.videoId;

  try {
    const [videoSnap, homeContentSnap] = await Promise.all([
      await videoDocument(videoId).withConverter(videoConverter).get(),
      await contentDocument('home').withConverter(homeConverter).get(),
    ]);
    const video = videoSnap.data();
    if (!isEnablePublic(video)) throw new Error('Video not found');
    return {
      props: {
        homeContent: homeContentSnap?.data() ?? null,
        video,
        videoId: params.videoId,
      },
      revalidate: 1,
    };
  } catch (e) {
    console.log(e);
    return {
      notFound: true,
      props: {
        homeContent: null,
        video: null,
        videoId: null,
      },
      revalidate: 1,
    };
  }
};

const VideoId = ({
  homeContent,
  video: initialVideo,
  videoId,
}: Props): JSX.Element => {
  const isSm = useMediaQuery('(max-width: 960px)');
  const dispatch = useDispatch<ThunkDispatch>();

  const { isInitialized, user } = useAuth();
  const { targetVideo } = useSelector(videoSelectors.archive);
  const { livestreaming } = useSelector(livestreamingSelectors.state);
  const { srcUrl } = useVideoAuthorization(videoId);

  React.useEffect(() => {
    if (videoId) {
      dispatch(videoActions.setTargetVideoId({ targetVideoId: videoId }));
    }
  }, [videoId, dispatch]);

  React.useEffect(() => {
    if (!isInitialized || !videoId) return;

    const unsub = videoCollection()
      .withConverter(videoConverter)
      .where('id', '==', videoId)
      .where('status', 'in', [VideoStatus.Limited, VideoStatus.Published])
      .where('publishedAt', '<', new Date())
      .onSnapshot((snap) => {
        const video = snap.docs[0]?.data();
        if (video) {
          dispatch(videoActions.setVideo({ video }));
        }
      });

    return () => unsub();
  }, [isInitialized, videoId, user, dispatch]);

  return (
    <>
      <MetaHead
        title={`${initialVideo?.title} | ますかれーど`}
        description={initialVideo?.description ?? ''}
        keyword={''}
        image={initialVideo?.thumbnailUrl ?? ''}
        url={`/videos/${initialVideo?.id}`}
        upgradeInsecureRequests={false}
      />
      {!isSm && <Header onClickExpandIcon={() => console.log('')} />}
      <Wrapper
        headerHeight={HEADER_HEIGHT}
        headerHeightSm={HEADER_HEIGHT_SM}
        footerHeight={FOOTER_HEIGHT}
      >
        {targetVideo &&
        targetVideo.uploadStatus === VideoUploadStatus.Transcoded ? (
          <VideoOutline video={targetVideo} srcUrl={srcUrl} />
        ) : (
          livestreaming && (
            <TranscodingOutline
              video={targetVideo}
              livestreaming={livestreaming}
            />
          )
        )}

        {!initialVideo && <NotFound />}
      </Wrapper>
      {!isSm && <Footer additionalLinks={homeContent?.sideLinks ?? []} />}
    </>
  );
};

export default VideoId;
