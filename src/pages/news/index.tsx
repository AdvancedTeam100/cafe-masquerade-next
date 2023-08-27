import React from 'react';
import type { InferGetStaticPropsType } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import { newsCollection, newsConverter } from '@/libs/firebase/firestore/news';
import { getPublishedNewsTags } from '@/libs/firebase/firestore/newsTag';
import { NewsStatus } from '@/libs/models/news';
import { colors } from '@/config/ui';
import Template from '@/containers/app/Template';
import MetaHead from '@/components/common/Head';
import TweetItemList from '@/components/app/common/TweetItemList';
import SectionTitle from '@/components/app/common/SectionTitle';
import NewsListItem from '@/components/app/news/NewsListItem';
import TagItem from '@/components/app/common/TagItem';
import SmTagList from '@/components/app/news/SmTagList';
import Pagination from '@/components/app/common/Pagination';

export const PAGE_PER_COUNT = 10;

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

export const getStaticProps = async () => {
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
          .slice(0, PAGE_PER_COUNT)
          .map((doc) => doc.data()),
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
        totalNewsCount: 0,
        newsTags: [],
      },
      revalidate: 1,
    };
  }
};

const NewsIndex = ({
  homeContent,
  news,
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
            currentPage={1}
            totalCount={totalNewsCount}
            perPageCount={PAGE_PER_COUNT}
            href="/news/pages"
          />
        </Paper>
      </Template>
    </>
  );
};

export default NewsIndex;
