import React from 'react';
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import {
  accessableNewsQuery,
  getLatestNews,
  newsCollection,
  newsConverter,
} from '@/libs/firebase/firestore/news';
import { NewsStatus } from '@/libs/models/news';
import MetaHead from '@/components/common/Head';
import NewsDetailContainer from '@/containers/common/NewsDetailContainer';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

type Query = {
  newsId: string;
};

export const getStaticPaths: GetStaticPaths<Query> = async () => {
  try {
    const newsQuerySnap = await newsCollection()
      .where('status', '==', NewsStatus.Published)
      .where('publishedAt', '<=', new Date())
      .orderBy('publishedAt', 'desc')
      .get();

    const paths = newsQuerySnap.docs.map((doc) => ({
      params: {
        newsId: doc.id,
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
    const [homeContentSnap, newsSnap, latestNews] = await Promise.all([
      await contentDocument('home').withConverter(homeConverter).get(),
      await accessableNewsQuery(params.newsId)
        .withConverter(newsConverter)
        .get(),
      await getLatestNews(),
    ]);

    if (newsSnap.size !== 1) {
      throw new Error('無効なニュースIDです');
    }

    return {
      props: {
        homeContent: homeContentSnap?.data() ?? null,
        news: newsSnap.docs[0]?.data() ?? null,
        latestNews,
        newsId: params.newsId,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        homeContent: null,
        news: null,
        latestNews: [],
        newsId: '',
      },
      revalidate: 1,
    };
  }
};

const NewsId = ({
  homeContent,
  news,
  latestNews,
  newsId,
}: Props): JSX.Element => (
  <>
    <MetaHead
      title={`${news?.title} | ますかれーど`}
      description={news?.description ?? ''}
      keyword={''}
      image={news?.imageUrl ?? ''}
      url={`/news/${newsId}`}
    />
    <NewsDetailContainer
      homeContent={homeContent}
      latestNews={latestNews}
      news={news}
    />
  </>
);

export default NewsId;
