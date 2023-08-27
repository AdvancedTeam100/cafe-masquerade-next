import CastScheduleList from '@/components/app/cast/CastScheduleList';
import SectionTitle from '@/components/app/common/SectionTitle';
import DateList from '@/components/app/schedule/DateList';
import MetaHead from '@/components/common/Head';
import { colors } from '@/config/ui';
import Template from '@/containers/app/Template';
import { castCollection, castConverter } from '@/libs/firebase/firestore/cast';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import {
  scheduleCollection,
  scheduleConverter,
} from '@/libs/firebase/firestore/schedule';
import { CastStatus } from '@/libs/models/cast';
import { LivestreamingStatus } from '@/libs/models/livestreaming';
import { ScheduleType } from '@/libs/models/schedule';
import { LiveBroadcastContent } from '@/libs/models/youtubeVideo';
import { notNull } from '@/libs/utils/array';
import {
  getDateStringHyphens,
  getNextDaysStr,
  getStartOfDate,
  getStartOfNextDate,
  getStartOfPreviousDate,
} from '@/libs/utils/dateFormat';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import type { InferGetStaticPropsType } from 'next';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  },
  dateList: {
    padding: theme.spacing(2, 5),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2, 0),
    },
  },
  matchResult: {
    color: colors.brown,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    fontSize: '14px',
    margin: 0,
  },
  scheduleList: {
    padding: '0 40px',
  },
}));

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  try {
    const [
      homeContentSnap,
      castQuerySnap,
      scheduleQuerySnap,
      activeScheduleQuerySnap,
    ] = await Promise.all([
      await contentDocument('home').withConverter(homeConverter).get(),
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
        castSchedules,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        homeContent: null,
        castSchedules: [],
      },
      revalidate: 1,
    };
  }
};

const Schedules = ({ homeContent, castSchedules }: Props): JSX.Element => {
  const classes = useStyles();
  const isSm = useMediaQuery('(max-width: 960px)');
  return (
    <>
      <MetaHead
        title={'出勤表 | ますかれーど'}
        keyword={''}
        image={'/ogp_image.png'}
        url={'/schedules'}
      />
      <Template
        hasSideBar={false}
        sideLinks={homeContent?.sideLinks ?? []}
        breadcrumb={{
          child: {
            title: '出勤表',
          },
        }}
      >
        <Paper className={classes.container}>
          <SectionTitle title="出勤表" subTitle="Schedule" />
          <div className={classes.dateList}>
            <DateList
              currentDate={getDateStringHyphens(new Date())}
              dateList={getNextDaysStr(7)}
            />
          </div>
          {(isSm || castSchedules.length === 0) && (
            <p className={classes.matchResult}>
              {castSchedules.length}人の女の子がお給仕予定です
            </p>
          )}
          {!isSm && (
            <div className={classes.scheduleList}>
              <CastScheduleList
                castSchedules={castSchedules}
                breakpointsCols={4}
              />
            </div>
          )}
        </Paper>
        {isSm && (
          <CastScheduleList castSchedules={castSchedules} breakpointsCols={2} />
        )}
      </Template>
    </>
  );
};

export default Schedules;
