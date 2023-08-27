import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import { colors } from '@/config/ui';
import {
  Schedule,
  ScheduleType,
  checkIsLivestreaming,
} from '@/libs/models/schedule';
import { getTime } from '@/libs/utils/dateFormat';
import { useThumbnail } from '@/hooks/thumbnail';
import TwitcastingIcon from '../../svg/twitcasting_icon.svg';
import YouTubeIcon from '../../svg/youtube_icon.svg';
import NiconicoIcon from '../../svg/niconico_icon.svg';
import TwitchIcon from '../../svg/twitch_icon.svg';
import FC2Icon from '../../svg/fc2__icon.svg';
import TikTokIcon from '../../svg/tiktok_icon.svg';

const getScheduleTypeLabel = (type: ScheduleType) => {
  switch (type) {
    case ScheduleType.Holiday:
      return 'お休み';
    case ScheduleType.YouTube:
    case ScheduleType.None:
      return 'YouTube';
    case ScheduleType.Twitcasting:
      return 'ツイキャス';
    case ScheduleType.Niconico:
      return 'ニコニコ';
    case ScheduleType.Twitch:
      return 'Twitch';
    case ScheduleType.FC2:
      return 'FC2';
    case ScheduleType.TikTok:
      return 'TikTok';
    case ScheduleType.LiveAction:
    case ScheduleType.LimitedBefore:
    case ScheduleType.LimitedOnly:
      return 'ますかれーど';
    case ScheduleType.AfterTalk:
      return '通常お給仕終了後に実施';
    default:
      return '';
  }
};

const getScheduleHeaderBackgroundImage = (type: ScheduleType) => {
  switch (type) {
    case ScheduleType.LiveAction:
      return '/schedule_gold.png';
    case ScheduleType.AfterTalk:
    case ScheduleType.LimitedBefore:
    case ScheduleType.LimitedOnly:
      return '/schedule_silver.png';
    default:
      return undefined;
  }
};

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(1),
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    background: colors.darkPink,
    borderRadius: '8px',
    padding: theme.spacing(0.5),
    height: '32px',
    backgroundSize: 'cover',
    '& span': {
      margin: theme.spacing(0, 0.5),
      fontSize: '16px',
      fontWeight: 500,
      [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(0, 0),
        fontSize: '13px',
        lineHeight: '16px',
        fontWeight: 500,
      },
    },
    '& svg': {
      fontSize: '16px',
      margin: '0 2px',
    },
  },
  video: {
    margin: theme.spacing(1, 0, 0),
    position: 'relative',
    overflow: 'hidden',
  },
  videoThumbContainer: {
    position: 'relative',
  },
  videoThumbAlt: {
    position: 'relative',
    '&::before': {
      position: 'absolute',
      opacity: 0,
      transition: 'all 0.5s',
      '-webkit-transition': 'all 0.5s',
      content: 'attr(data-content)',
      width: '100%',
      color: '#fff',
      zIndex: 1,
      bottom: 0,
      top: 0,
      left: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '16px',
      boxSizing: 'border-box',
      '-moz-box-sizing': 'border-box',
    },
    '&:hover:before': {
      opacity: 1,
    },
  },
  videoThumb: {
    width: '100%',
  },
  videoTitle: {
    fontSize: '14px',
    color: colors.brown,
    fontWeight: 700,
    margin: '4px 0',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': 3,
      overflow: 'hidden',
    },
  },
  videoLink: {
    '&:hover': {
      opacity: 0.7,
    },
  },
  serviceIcon: {
    width: '20px',
    height: '20px',
    '& svg': {
      fontSize: '12px',
    },
  },
}));

const ServiceIcon = memo<{ type: ScheduleType }>(({ type }) => {
  const classes = useStyles();
  switch (type) {
    case ScheduleType.YouTube:
    case ScheduleType.None:
      return (
        <span className={classes.serviceIcon}>
          <YouTubeIcon />
        </span>
      );
    case ScheduleType.Twitcasting:
      return (
        <span className={classes.serviceIcon}>
          <TwitcastingIcon />
        </span>
      );
    case ScheduleType.Niconico:
      return (
        <span className={classes.serviceIcon}>
          <NiconicoIcon />
        </span>
      );
    case ScheduleType.Twitch:
      return (
        <span className={classes.serviceIcon}>
          <TwitchIcon />
        </span>
      );
    case ScheduleType.FC2:
      return (
        <span className={classes.serviceIcon}>
          <FC2Icon />
        </span>
      );
    case ScheduleType.TikTok:
      return (
        <span className={classes.serviceIcon}>
          <TikTokIcon />
        </span>
      );
    default:
      return <></>;
  }
});

type Props = {
  schedule: Schedule;
  youtubeChannelId: string;
};

const ScheduleItem = memo<Props>(({ schedule, youtubeChannelId }) => {
  const classes = useStyles();
  const thumb = useThumbnail(
    schedule.type,
    schedule.youtubeVideo?.thumbnails,
    schedule.livestreaming?.thumbnailUrl,
  );
  const label = getScheduleTypeLabel(schedule.type);
  const backgroundImageUrl = getScheduleHeaderBackgroundImage(schedule.type);
  const isLivestreaming = checkIsLivestreaming(schedule.type);
  return (
    <div className={classes.container}>
      <div
        className={classes.header}
        style={{
          backgroundImage: backgroundImageUrl
            ? `url("${backgroundImageUrl}")`
            : 'inherit',
        }}
      >
        {schedule.isActive ? (
          <>
            <LiveTvIcon htmlColor="white" fontSize="small" />
            <span>現在お給仕中</span>
          </>
        ) : (
          <>
            {schedule.type !== 'AfterTalk' && (
              <QueryBuilderIcon htmlColor="white" fontSize="small" />
            )}
            <span>
              {schedule.type !== 'AfterTalk' &&
                `${getTime(schedule.startAt)}~${label !== '' && ' | '}`}
              {label}
            </span>
            <ServiceIcon type={schedule.type} />
          </>
        )}
      </div>
      <div className={classes.video}>
        <div className={classes.videoThumbContainer}>
          {isLivestreaming ? (
            schedule.livestreaming ? (
              <Link href={`/livestreaming/${schedule.livestreaming.id}`}>
                <a>
                  <Image
                    className={clsx(classes.videoThumb, classes.videoLink)}
                    height={thumb.height}
                    width={thumb.width}
                    src={thumb.url}
                  />
                </a>
              </Link>
            ) : (
              <div
                className={classes.videoThumbAlt}
                data-content="現在お給仕準備中です"
              >
                <Image
                  className={classes.videoThumb}
                  height={thumb.height}
                  width={thumb.width}
                  src={thumb.url}
                />
              </div>
            )
          ) : (
            <a
              href={
                schedule.url ||
                (youtubeChannelId.startsWith('http')
                  ? youtubeChannelId
                  : `https://www.youtube.com/channel/${youtubeChannelId}`)
              }
              target="_blank"
              rel="noreferrer noopener"
            >
              <Image
                className={clsx(classes.videoThumb, classes.videoLink)}
                height={thumb.height}
                width={thumb.width}
                src={thumb.url}
              />
            </a>
          )}
        </div>
        {isLivestreaming ? (
          schedule.livestreaming ? (
            <Link href={`/livestreaming/${schedule.livestreaming.id}`}>
              <a className={clsx(classes.videoTitle, classes.videoLink)}>
                {schedule.title}
              </a>
            </Link>
          ) : (
            <span className={classes.videoTitle}>{schedule.title}</span>
          )
        ) : (
          <a
            className={clsx(classes.videoTitle, classes.videoLink)}
            href={
              schedule.url ||
              `https://www.youtube.com/channel/${youtubeChannelId}`
            }
            target="_blank"
            rel="noreferrer noopener"
          >
            {schedule.title}
          </a>
        )}
      </div>
    </div>
  );
});

export default ScheduleItem;
