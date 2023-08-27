import React from 'react';
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import {
  castImageCollection,
  castImageConverter,
} from '@/libs/firebase/firestore/castImage';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import {
  castCollection,
  castConverter,
  castDocument,
} from '@/libs/firebase/firestore/cast';
import { getCastSchedules } from '@/libs/firebase/firestore/schedule';
import { getCastYoutubeVideos } from '@/libs/firebase/firestore/youtubeVideo';
import { CastStatus } from '@/libs/models/cast';
import MetaHead from '@/components/common/Head';
import CastDetailContainer from '@/containers/common/CastDetailContainer';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

type Query = {
  castId: string;
};

export const getStaticPaths: GetStaticPaths<Query> = async () => {
  try {
    const castQuerySnap = await castCollection()
      .where('status', '==', CastStatus.Published)
      .orderBy('joinedAt', 'desc')
      .get();

    const paths = castQuerySnap.docs.map((doc) => ({
      params: {
        castId: doc.id,
      },
    }));

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
    const [
      homeContentSnap,
      castSnap,
      castImageQuerySnap,
      castSchedules,
      youtubeVideos,
    ] = await Promise.all([
      await contentDocument('home').withConverter(homeConverter).get(),
      await castDocument(params.castId).withConverter(castConverter).get(),
      await castImageCollection(params.castId)
        .withConverter(castImageConverter)
        .get(),
      await getCastSchedules(params.castId),
      await getCastYoutubeVideos(params.castId),
    ]);
    return {
      props: {
        homeContent: homeContentSnap?.data() ?? null,
        cast: castSnap?.data() ?? null,
        castImages: castImageQuerySnap.docs.map((doc) => doc.data()),
        castId: params.castId,
        castSchedules,
        youtubeVideos,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        homeContent: null,
        cast: null,
        castImages: [],
        castId: '',
        castSchedules: [],
        youtubeVideos: [],
      },
      revalidate: 1,
    };
  }
};

const CastId = ({
  homeContent,
  cast,
  castImages,
  castId,
  castSchedules,
  youtubeVideos,
}: Props): JSX.Element => (
  <>
    <MetaHead
      title={`${cast?.name} | ますかれーど`}
      description={cast?.description ?? ''}
      keyword={cast?.tags.map((tag) => tag).join(',') ?? ''}
      image={cast?.imageUrl ?? ''}
      url={`/cast/${castId}`}
    />
    <CastDetailContainer
      cast={cast}
      castImages={castImages}
      castSchedules={castSchedules}
      homeContent={homeContent}
      youtubeVideos={youtubeVideos}
    />
  </>
);

export default CastId;
