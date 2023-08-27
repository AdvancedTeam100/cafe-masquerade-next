import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import { colors } from '@/config/ui';
import { Schedule } from '@/libs/models/schedule';
import { getDateString, getDateTimeString } from '@/libs/utils/dateFormat';
import { useThumbnail } from '@/hooks/thumbnail';
import { Cast } from '@/libs/models/cast';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  videoThumbContainer: {
    position: 'relative',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50%',
    },
  },
  videoInfoContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      width: '50%',
      marginLeft: theme.spacing(2),
    },
  },
  videoLiveLabel: {
    position: 'absolute',
    right: 0,
    height: '22px',
    borderRadius: '4px',
    margin: '4px',
    padding: '0 4px',
    bottom: '7px',
    color: 'white',
    fontWeight: 500,
    fontSize: '12px',
    background: colors.youtubeRed,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    '& svg': {
      fontSize: '16px',
      margin: '0 2px',
    },
  },
  videoThumbAlt: {
    position: 'relative',
    borderRadius: '4px',
    '&::before': {
      position: 'absolute',
      borderRadius: '4px',
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
    borderRadius: '4px',
  },
  videoTitle: {
    fontSize: '18px',
    color: colors.brown,
    fontWeight: 700,
    margin: '4px 0',
    textDecoration: 'none',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 1,
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      '-webkit-line-clamp': 2,
    },
  },
  videoLink: {
    '&:hover': {
      opacity: 0.7,
    },
  },
  infoText: {
    color: colors.brown,
    margin: '4px 0',
    '& a': {
      color: colors.linkTextBlue,
      textDecoration: 'underline',
    },
  },
}));

type Props = {
  schedule: Schedule;
  cast: Cast;
};

const ScheduleItem = memo<Props>(({ schedule, cast }) => {
  const classes = useStyles();
  const isSm = useMediaQuery('(max-width: 960px)');
  const thumb = useThumbnail(
    schedule.type,
    schedule.youtubeVideo?.thumbnails,
    schedule.livestreaming?.thumbnailUrl,
  );
  const title =
    schedule.type === 'LiveAction' && schedule.livestreaming
      ? schedule.title
      : `${cast.name}による${schedule.title}`;

  return (
    <div className={classes.container}>
      <div className={classes.videoThumbContainer}>
        {schedule.isActive && (
          <div className={classes.videoLiveLabel}>
            <OndemandVideoIcon htmlColor="white" fontSize="small" />
            お給仕中
          </div>
        )}
        {schedule.livestreaming ? (
          <Link href={`/livestreaming/${schedule.livestreaming.id}`}>
            <a>
              <Image
                className={clsx(classes.videoThumb, classes.videoLink)}
                height={isSm ? thumb.height : 306}
                width={isSm ? thumb.width : 544}
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
              height={isSm ? thumb.height : 306}
              width={isSm ? thumb.width : 544}
              src={thumb.url}
            />
          </div>
        )}
      </div>
      <div className={classes.videoInfoContainer}>
        {schedule.livestreaming ? (
          <Link href={`/livestreaming/${schedule.livestreaming.id}`}>
            <a className={clsx(classes.videoTitle, classes.videoLink)}>
              {title}
            </a>
          </Link>
        ) : (
          <span className={classes.videoTitle}>{title}</span>
        )}
        <span className={classes.infoText}>
          {schedule.type === 'AfterTalk'
            ? `${getDateString(schedule.startAt)} 通常お給仕終了後に配信予定`
            : `${getDateTimeString(schedule.startAt)} 配信予定`}
        </span>
        <span className={classes.infoText}>
          {!isSm &&
            '『ますかれーど』では、当店をご支援頂ける特別なご主人様に向けた会員限定のオンラインサロンをご用意させて頂いております。'}
          当サロンでは、ご主人様同士の交流の機会や、YouTubeでは配信出来ないようなお給仕の提供をさせて頂きます。オンラインサロンの詳細は
          <a
            href="https://ci-en.dlsite.com/creator/7561/plan"
            target="_blank"
            rel="noreferrer noopener"
          >
            こちら
          </a>
          をご確認ください。
        </span>
      </div>
    </div>
  );
});

export default ScheduleItem;
