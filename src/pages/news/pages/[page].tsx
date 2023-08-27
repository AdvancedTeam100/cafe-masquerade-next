import React from 'react';
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import { newsCollection, newsConverter } from '@/libs/firebase/firestore/news';
import { NewsStatus } from '@/libs/models/news';
import { getPublishedNewsTags } from '@/libs/firebase/firestore/newsTag';
import { colors } from '@/config/ui';
import Template from '@/containers/app/Template';
import MetaHead from '@/components/common/Head';
import SectionTitle from '@/components/app/common/SectionTitle';
import TweetItemList from '@/components/app/common/TweetItemList';
import NewsListItem from '@/components/app/news/NewsListItem';
import TagItem from '@/components/app/common/TagItem';
import SmTagList from '@/components/app/news/SmTagList';
import Pagination from '@/components/app/common/Pagination';
import { PAGE_PER_COUNT } from '../index';

const useStyles = makeStyles((theme) => ({
  newsContainer: {
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),
    },
  },
  tagList: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing(2, 0, 2, 2),
    margin: theme.spacing(0, 4, 2),
    borderBottom: `1px solid ${colors.border}`,
  },
  tag: {
    margin: '8px 4px 0 0',
  },
}));

type Props = InferGetStaticPropsType<typeof getStaticProps>;

type Query = {
  page: string;
};

export const getStaticPaths: GetStaticPaths<Query> = async () => {
  try {
    const newsQuerySnap = await newsCollection()
      .where('status', '==', NewsStatus.Published)
      .where('publishedAt', '<=', new Date())
      .orderBy('publishedAt', 'desc')
      .get();

    const pageLength = Math.ceil(newsQuerySnap.size / PAGE_PER_COUNT);
    const paths = [...Array(pageLength).keys()].map((page) => ({
      params: {
        page: String(page + 1),
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
  const page = Number(params.page);
  try {
    const [homeContentSnap, newsQuerySnap] = await Promise.all([
      await contentDocument('home').withConverter(homeConverter).get(),
      await newsCollection()
        .withConverter(newsConverter)
        .where('status', '==', NewsStatus.Published)
        .where('publishedAt', '<=', new Date())
        .orderBy('publishedAt', 'desc')
        .get(),
    ]);
    const newsTags = await getPublishedNewsTags(newsQuerySnap);
    return {
      props: {
        homeContent: homeContentSnap?.data() ?? null,
        news: newsQuerySnap.docs
          .slice(PAGE_PER_COUNT * (page - 1), PAGE_PER_COUNT * page)
          .map((doc) => doc.data()),
        currentPage: page,
        totalNewsCount: newsQuerySnap.size,
        newsTags,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        homeContent: null,
        news: [],
        currentPage: 0,
        totalNewsCount: 0,
        newsTags: [],
      },
      revalidate: 1,
    };
  }
};

const NewsPage = ({
  homeContent,
  news,
  currentPage,
  totalNewsCount,
  newsTags,
}: Props): JSX.Element => {
  const classes = useStyles();
  const isSm = useMediaQuery('(max-width: 960px)');
  return (
    <>
      <MetaHead
        title={'お知らせ | ますかれーど'}
        keyword={''}
        image={'/ogp_image.png'}
        url={'/'}
      />
      <Template
        hasSideBar={true}
        sideLinks={homeContent?.sideLinks ?? []}
        breadcrumb={{
          child: {
            title: 'お知らせ',
          },
        }}
        additionalSideComponents={[
          isSm ? undefined : (
            <TweetItemList
              title="口コミ"
              subTitle="Reviews"
              tweetIds={homeContent?.reviewTweetIds ?? []}
            />
          ),
          isSm ? undefined : (
            <TweetItemList
              title="今何してる？"
              subTitle="Girls' tweets"
              tweetIds={homeContent?.castsTweetIds?.slice(0, 10) ?? []}
            />
          ),
        ]}
      >
        <Paper className={classes.newsContainer}>
          <SectionTitle title="お知らせ" subTitle="News" />
          {!isSm && (
            <div className={classes.tagList}>
              <div className={classes.tag}>
                <TagItem title={'All'} isOutlined={false} href={'/news'} />
              </div>
              {newsTags.map((tag) => (
                <div className={classes.tag} key={`tags-${tag.name}`}>
                  <TagItem
                    title={tag.name}
                    isOutlined={true}
                    href={`/news/tags/${tag.name}`}
                  />
                </div>
              ))}
            </div>
          )}
          {news &&
            news.map((newsItem) => (
              <NewsListItem news={newsItem} key={`news-${newsItem.id}`} />
            ))}
          {isSm && <SmTagList newsTags={newsTags} />}
          <Pagination
            currentPage={currentPage}
            totalCount={totalNewsCount}
            perPageCount={PAGE_PER_COUNT}
            href="/news/pages"
          />
        </Paper>
      </Template>
    </>
  );
};

export default NewsPage;
