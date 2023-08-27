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
import { castCollection, castConverter } from '@/libs/firebase/firestore/cast';
import {
  scheduleCollection,
  scheduleConverter,
} from '@/libs/firebase/firestore/schedule';
import {
  getStartOfDate,
  getStartOfNextDate,
  getStartOfPreviousDate,
} from '@/libs/utils/dateFormat';
import { CastStatus } from '@/libs/models/cast';
import { NewsStatus } from '@/libs/models/news';
import { ScheduleType } from '@/libs/models/schedule';
import { LiveBroadcastContent } from '@/libs/models/youtubeVideo';
import { LivestreamingStatus } from '@/libs/models/livestreaming';
import { notNull } from '@/libs/utils/array';
import { colors } from '@/config/ui';
import Template from '@/containers/app/Template';
import MetaHead from '@/components/common/Head';
import Carousel from '@/components/app/common/Carousel';
import TopBanner from '@/components/app/common/TopBanner';
import TweetItemList from '@/components/app/common/TweetItemList';
import SectionTitle from '@/components/app/common/SectionTitle';
import NewsListItem from '@/components/app/news/NewsListItem';
import CastScheduleList from '@/components/app/cast/CastScheduleList';

const useStyles = makeStyles((theme) => ({
  container: {},
  sliderContainer: {
    paddingBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0, -1, 0),
      borderRadius: '0px !important',
    },
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(3),
    },
  },
  topBanner: {
    margin: theme.spacing('10px', -1),
  },
  newsContainer: {
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(4),
  },
  titleContainer: {
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(2),
  },
  castContainer: {
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(2),
    },
  },
}));

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  try {
    const [
      homeContentSnap,
      newsQuerySnap,
      castQuerySnap,
      scheduleQuerySnap,
      activeScheduleQuerySnap,
    ] = await Promise.all([
      await contentDocument('home').withConverter(homeConverter).get(),
      await newsCollection()
        .withConverter(newsConverter)
        .where('status', '==', NewsStatus.Published)
        .where('publishedAt', '<=', new Date())
        .orderBy('publishedAt', 'desc')
        .limit(5)
        .get(),
      await castCollection()
        .withConverter(castConverter)
        .where('status', '==', CastStatus.Published)
        .orderBy('joinedAt', 'desc')
        .get(),
      await scheduleCollection()
        .withConverter(scheduleConverter)
        .where('startAt', '>=', getStartOfDate())
        .where('startAt', '<', getStartOfNextDate())
        .orderBy('startAt', 'asc')
        .get(),
      await scheduleCollection()
        .withConverter(scheduleConverter)
        .where('isActive', '==', true)
        .where('startAt', '>=', getStartOfPreviousDate())
        .where('startAt', '<', getStartOfDate())
        .orderBy('startAt', 'asc')
        .get(),
    ]);
    const casts = castQuerySnap.docs.map((doc) => doc.data());
    const _schedules = [
      ...activeScheduleQuerySnap.docs,
      ...scheduleQuerySnap.docs,
    ]
      .map((doc) => doc.data())
      .filter(
        (schedule) =>
          schedule.type !== ScheduleType.Holiday &&
          schedule.type !== ScheduleType.Canceled &&
          !(
            schedule.livestreaming?.status === LivestreamingStatus.Finished ||
            schedule.youtubeVideo?.liveBroadcastContent ===
              LiveBroadcastContent.None
          ),
      );
    const castSchedules = casts
      .map((cast) => {
        const schedules = _schedules.filter(
          (schedule) => schedule.castId === cast.id,
        );
        const isActive = schedules.some((schedule) => schedule.isActive);
        if (schedules.length > 0) {
          return {
            cast,
            schedules,
            isActive,
          };
        } else {
          return null;
        }
      })
      .filter(notNull)
      .sort((a, b) => {
        if (a.schedules[0] && b.schedules[0]) {
          return (
            new Date(a.schedules[0].startAt).getTime() -
            new Date(b.schedules[0].startAt).getTime()
          );
        } else {
          return 1;
        }
      });
    return {
      props: {
        homeContent: homeContentSnap?.data() ?? null,
        news: newsQuerySnap.docs.map((doc) => doc.data()),
        castSchedules,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        homeContent: null,
        news: [],
        castSchedules: [],
      },
      revalidate: 1,
    };
  }
};

const Index = ({ homeContent, news, castSchedules }: Props): JSX.Element => {
  const classes = useStyles();
  const isSm = useMediaQuery('(max-width: 960px)');
  return (
    <>
      <MetaHead
        title={'バーチャルメイド喫茶『ますかれーど』公式WEBサイト'}
        keyword={''}
        image={'/ogp_image.png'}
        url={'/'}
      />
      <Template
        hasSideBar={true}
        sideLinks={homeContent?.sideLinks ?? []}
        breadcrumb={{}}
        additionalSideComponents={[
          <TweetItemList
            title="口コミ"
            subTitle="Reviews"
            tweetIds={homeContent?.reviewTweetIds ?? []}
          />,
          <TweetItemList
            title="今何してる？"
            subTitle="Girls' tweets"
            tweetIds={homeContent?.castsTweetIds?.slice(0, 10) ?? []}
          />,
        ]}
      >
        <Paper className={classes.sliderContainer}>
          <Carousel
            images={homeContent?.topImages.slice().reverse() ?? []}
            width={1600}
            height={900}
          />
        </Paper>
        {isSm && (
          <div className={classes.topBanner}>
            <TopBanner />
          </div>
        )}
        <Paper className={classes.newsContainer}>
          <SectionTitle title="お知らせ" subTitle="News" />
          {news &&
            news.map((newsItem) => (
              <NewsListItem news={newsItem} key={`news-${newsItem.id}`} />
            ))}
        </Paper>
        <Paper className={classes.titleContainer}>
          <SectionTitle
            title="本日の出勤情報"
            subTitle="Casts' Schedule"
            customColor={colors.darkPink}
          />
        </Paper>
        <CastScheduleList
          castSchedules={castSchedules}
          breakpointsCols={isSm ? 2 : 3}
        />
      </Template>
    </>
  );
};

export default Index;
