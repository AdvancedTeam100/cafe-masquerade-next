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
import {
  getPublishedNewsTags,
  newsTagCollection,
  newsTagConverter,
} from '@/libs/firebase/firestore/newsTag';
import { newsCollection, newsConverter } from '@/libs/firebase/firestore/news';
import { NewsStatus } from '@/libs/models/news';
import { colors } from '@/config/ui';
import Template from '@/containers/app/Template';
import MetaHead from '@/components/common/Head';
import SectionTitle from '@/components/app/common/SectionTitle';
import TweetItemList from '@/components/app/common/TweetItemList';
import NewsListItem from '@/components/app/news/NewsListItem';
import TagItem from '@/components/app/common/TagItem';
import SmTagList from '@/components/app/news/SmTagList';
import Pagination from '@/components/app/common/Pagination';
import { PAGE_PER_COUNT } from '../../../index';

const useStyles = makeStyles((theme) => ({
  newsContainer: {
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),
    },
  },
  titleLabel: {
    color: colors.brown,
    opacity: 0.5,
    textAlign: 'center',
    margin: theme.spacing(1, 0),
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
  tagName: string;
  page: string;
};

export const getStaticPaths: GetStaticPaths<Query> = async () => {
  try {
    const newsTagQuerySnap = await newsTagCollection()
      .withConverter(newsTagConverter)
      .get();

    const paths = await Promise.all(
      newsTagQuerySnap.docs.map(async (doc) => {
        const newsQuerySnap = await newsCollection()
          .where('status', '==', NewsStatus.Published)
          .where('publishedAt', '<=', new Date())
          .where('tags', 'array-contains', doc.id)
          .orderBy('publishedAt', 'desc')
          .get();
        const pageLength = Math.ceil(newsQuerySnap.size / PAGE_PER_COUNT);
        return [...Array(pageLength).keys()].map((page) => ({
          params: {
            page: String(page + 1),
            tagName: doc.id,
          },
        }));
      }),
    );

    return {
      paths: paths.reduce((acc, x) => acc.concat(x), []),
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
    const [homeContentSnap, newsQuerySnap, newsTags] = await Promise.all([
      await contentDocument('home').withConverter(homeConverter).get(),
      await newsCollection()
        .withConverter(newsConverter)
        .where('status', '==', NewsStatus.Published)
        .where('publishedAt', '<=', new Date())
        .where('tags', 'array-contains', params.tagName)
        .orderBy('publishedAt', 'desc')
        .get(),
      await getPublishedNewsTags(),
    ]);
    return {
      props: {
        homeContent: homeContentSnap?.data() ?? null,
        news: newsQuerySnap.docs
          .slice(PAGE_PER_COUNT * (page - 1), PAGE_PER_COUNT * page)
          .map((doc) => doc.data()),
        newsTags,
        tagName: params.tagName,
        currentPage: page,
        totalNewsCount: newsQuerySnap.size,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        homeContent: null,
        news: [],
        newsTags: [],
        tagName: '',
        currentPage: 0,
        totalNewsCount: 0,
      },
      revalidate: 1,
    };
  }
};

const NewsTagPage = ({
  homeContent,
  news,
  newsTags,
  tagName,
  currentPage,
  totalNewsCount,
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
                <TagItem title={'All'} isOutlined={true} href={'/news'} />
              </div>
              {newsTags.map((tag) => (
                <div className={classes.tag} key={`tags-${tag.name}`}>
                  <TagItem
                    title={tag.name}
                    isOutlined={tag.name !== tagName}
                    href={
                      tag.name === tagName
                        ? undefined
                        : `/news/tags/${tag.name}`
                    }
                  />
                </div>
              ))}
            </div>
          )}
          {isSm && (
            <p className={classes.titleLabel}>{tagName}タグでの検索結果</p>
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
            href={`/news/tags/${tagName}/pages`}
          />
        </Paper>
      </Template>
    </>
  );
};

export default NewsTagPage;
