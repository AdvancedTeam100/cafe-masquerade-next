import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { InferGetStaticPropsType } from 'next';
// import Image from 'next/image';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import { ThunkDispatch } from '@/store';
import { videoOperations, videoSelectors } from '@/store/app/video';
import { checkIsLivestreaming } from '@/libs/models/schedule';
import { Cast, CastStatus } from '@/libs/models/cast';
import {
  scheduleCollection,
  scheduleConverter,
} from '@/libs/firebase/firestore/schedule';
import {
  castCollection,
  castConverter,
  castDocument,
} from '@/libs/firebase/firestore/cast';
import Template from '@/containers/app/Template';
import MetaHead from '@/components/common/Head';
import SectionTitle from '@/components/app/common/SectionTitle';
import { useAuth } from '@/hooks/auth';
import VideoListItem from '@/components/app/video/ListItem';
import VideoFilter from '@/containers/app/video/VideoFilter';
import NextScheduleItem from '@/components/app/schedule/NextScheduleItem';
import { colors } from '@/config/ui';
import { getStartOfPreviousDate } from '@/libs/utils/dateFormat';
import { LivestreamingStatus } from '@/libs/models/livestreaming';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  },
  loader: {
    margin: '200px auto',
    paddingTop: '32px',
    textAlign: 'center',
  },
  nextSchedule: {
    padding: theme.spacing(2, 5, 4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  },
  filter: {
    padding: theme.spacing(3, 5, 0),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  list: {
    padding: theme.spacing(0, 5, 2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  infiniteScroller: {
    overflow: 'hidden !important',
  },
  noContent: {
    textAlign: 'center',
    fontWeight: 700,
    color: colors.brownText,
    fontSize: '16px',
    margin: '64px auto',
    paddingTop: '32px',
  },
  announceWrapper: {
    backgroundColor: '#ffc0cb',
    display: 'flex',
    justifyContent: 'space-between',
    border: 'solid #ff0000 1px',
    borderRadius: '4px',
    margin: '20px 0',
    padding: '16px 44px',
    [theme.breakpoints.down('sm')]: {
      padding: '16px',
    },
  },
  announceMessage: {
    margin: '0',
    maxWidth: '95%',
    [theme.breakpoints.down('sm')]: {
      fontSize: '13px',
    },
  },
}));

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  try {
    const [
      homeContentSnap,
      castQuerySnap,
      activeSchedulesQuerySnap,
      scheduledQuerySnap,
      latestSchedulesQuerySnap,
    ] = await Promise.all([
      await contentDocument('home').withConverter(homeConverter).get(),
      await castCollection()
        .withConverter(castConverter)
        .where('status', '==', CastStatus.Published)
        .orderBy('joinedAt', 'desc')
        .get(),
      await scheduleCollection()
        .withConverter(scheduleConverter)
        .where('isActive', '==', true)
        .where('startAt', '>=', getStartOfPreviousDate())
        .orderBy('startAt', 'asc')
        .get(),
      await scheduleCollection()
        .withConverter(scheduleConverter)
        .where('startAt', '>=', getStartOfPreviousDate())
        .where('startAt', '<', new Date())
        .where('livestreaming.status', '==', LivestreamingStatus.Scheduled)
        .orderBy('startAt', 'asc')
        .get(),
      await scheduleCollection()
        .withConverter(scheduleConverter)
        .where('startAt', '>=', new Date())
        .orderBy('startAt', 'asc')
        .get(),
    ]);
    const casts = castQuerySnap.docs.map((doc) => doc.data());
    const schedules = [
      ...activeSchedulesQuerySnap.docs,
      ...scheduledQuerySnap.docs,
      ...latestSchedulesQuerySnap.docs,
    ].map((doc) => doc.data());
    const nextSchedule = schedules.find((schedule) => {
      return checkIsLivestreaming(schedule.type);
    });
    let nextScheduleCast: Cast | undefined;
    if (nextSchedule) {
      const castDoc = await castDocument(nextSchedule.castId)
        .withConverter(castConverter)
        .get();
      nextScheduleCast = castDoc.data();
    }

    return {
      props: {
        homeContent: homeContentSnap?.data() ?? null,
        casts,
        nextSchedule: nextSchedule ?? null,
        nextScheduleCast: nextScheduleCast ?? null,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        homeContent: null,
        casts: [],
        nextSchedule: null,
        nextScheduleCast: null,
      },
      revalidate: 1,
    };
  }
};

const Videos = ({
  homeContent,
  casts,
  nextSchedule,
  nextScheduleCast,
}: Props): JSX.Element => {
  const classes = useStyles();
  const isSm = useMediaQuery('(max-width: 960px)');
  const dispatch = useDispatch<ThunkDispatch>();
  const { videos, hasMore, isFetchingList, isInitialized } = useSelector(
    videoSelectors.videoList,
  );
  const { user, isFetching: isFetchingAuth } = useAuth();

  const getList = useCallback(() => {
    dispatch(videoOperations.getList());
  }, [dispatch]);

  return (
    <>
      <MetaHead
        title={'過去のお給仕 | ますかれーど'}
        keyword={''}
        image={'/ogp_image.png'}
        url={'/videos'}
      />
      <Template
        hasSideBar={false}
        sideLinks={homeContent?.sideLinks ?? []}
        breadcrumb={{
          child: {
            title: '過去のお給仕',
          },
        }}
      >
        {/* 再度表示する可能性があるのでコメントアウトとする
        <div className={classes.announceWrapper}>
          {!isSm && (
            <Image
              src={'/alert_icon.png'}
              width={35}
              height={35}
              objectFit="contain"
            />
          )}
          <p className={classes.announceMessage}>
            現在「アーカイブ自動公開機能」に、正常にデータ公開がされない・映像や音声が乱れるといった不具合が発生しております。つきましては、
            <a href="https://ci-en.dlsite.com/creator/7561/article">
              外部サービスCi-en
            </a>
            にてアーカイブ動画を公開しておりますので、そちらより正常なデータの動画をご視聴ください。
          </p>
        </div> */}
        <Paper className={classes.container}>
          <SectionTitle
            title="次回の限定お給仕予定"
            subTitle="Next live streaming"
          />
          <div className={classes.nextSchedule}>
            {nextSchedule && nextScheduleCast ? (
              <NextScheduleItem
                schedule={nextSchedule}
                cast={nextScheduleCast}
              />
            ) : (
              <p className={classes.noContent}>
                現在実施予定の限定お給仕はありません。
              </p>
            )}
          </div>
          <SectionTitle title="過去のお給仕" subTitle="Showcase" />
          <div className={classes.filter}>
            <VideoFilter casts={casts} />
          </div>
          {videos.length === 0 ? (
            <>
              {isFetchingList || isFetchingAuth || !isInitialized ? (
                <div className={classes.loader}>
                  <CircularProgress color="secondary" />
                </div>
              ) : (
                <p className={classes.noContent}>
                  該当するコンテンツが見つかりませんでした
                </p>
              )}
            </>
          ) : (
            <InfiniteScroll
              dataLength={videos.length}
              next={getList}
              hasMore={hasMore}
              loader={
                <div className={classes.loader}>
                  <CircularProgress color="secondary" />
                </div>
              }
              className={classes.infiniteScroller}
            >
              <Grid container spacing={isSm ? 0 : 2} className={classes.list}>
                {videos.map((video) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={`video-${video.id}=${new Date().toISOString()}`}
                  >
                    <>
                      <VideoListItem
                        video={video}
                        currentUserRole={user?.role ?? 'nonUser'}
                      />
                    </>
                  </Grid>
                ))}
              </Grid>
            </InfiniteScroll>
          )}
        </Paper>
      </Template>
    </>
  );
};

export default Videos;
