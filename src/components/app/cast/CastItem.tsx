import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { Theme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { colors } from '@/config/ui';
import { Cast } from '@/libs/models/cast';
import { Schedule } from '@/libs/models/schedule';
import TagItem from '@/components/app/common/TagItem';
import ScheduleItem from '@/components/app/schedule/ScheduleItem';

type Props = {
  cast: Cast;
  showTags: boolean;
  isSmRow?: boolean;
  schedules?: Schedule[];
  isActive?: boolean;
};

const useStyles = makeStyles<Theme, { isSmRow: boolean }>((theme) => ({
  link: {
    textDecoration: 'none',
    '&:hover': {
      opacity: 0.7,
    },
  },
  container: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.down('sm')]: {
      padding: ({ isSmRow }) => (isSmRow ? '12px 4px 4px' : '0'),
      borderRadius: ({ isSmRow }) => (isSmRow ? '0px !important' : '12px'),
      flexDirection: ({ isSmRow }) => (isSmRow ? 'row' : 'column'),
      borderBottom: ({ isSmRow }) =>
        isSmRow ? `3px solid ${colors.backgroundBeige}` : 'none',
      borderTop: ({ isSmRow }) =>
        isSmRow ? `1px solid ${colors.backgroundBeige}` : 'none',
    },
  },
  active: {
    border: `3px solid ${colors.lightPink} !important`,
    position: 'relative',
    borderTopLeftRadius: '0 !important',
    margin: '-2px',
  },
  activeLabel: {
    position: 'absolute',
    background: colors.lightPink,
    borderRadius: '6px 6px 0 0',
    color: 'white',
    top: '-26px',
    left: '-3px',
    zIndex: 100,
    padding: '2px 6px',
    fontWeight: 500,
  },
  imageContainer: {
    position: 'relative',
    display: 'block',
    [theme.breakpoints.down('sm')]: {
      width: ({ isSmRow }) => (isSmRow ? '40%' : 'inherit'),
    },
    [theme.breakpoints.up('md')]: {
      padding: '6px 6px 0',
    },
  },
  newLabel: {
    position: 'absolute',
    width: '40px',
    zIndex: 100,
    [theme.breakpoints.up('md')]: {
      width: '60px',
      top: '6px',
      right: '6px',
    },
    [theme.breakpoints.down('sm')]: {
      right: ({ isSmRow }) => (isSmRow ? 'none' : 0),
      left: ({ isSmRow }) => (isSmRow ? 0 : 'none'),
      top: ({ isSmRow }) => (isSmRow ? '-12px' : 0),
    },
  },
  image: {
    borderRadius: '12px',
  },
  castInfo: {
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      width: ({ isSmRow }) => (isSmRow ? '60%' : 'inherit'),
      padding: ({ isSmRow }) => (isSmRow ? '0' : '4px 4px'),
    },
  },
  castInfoTop: {
    padding: theme.spacing(1, 0),
    margin: theme.spacing(0, 1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `2px solid ${colors.lightPink}`,
    [theme.breakpoints.down('sm')]: {
      borderBottom: `1px solid ${colors.lightPink}`,
      margin: theme.spacing(0, 0, 0, 1),
    },
  },
  name: {
    fontSize: '18px',
    color: colors.brown,
    fontWeight: 700,
    margin: '2px 0',
    textDecoration: 'none',
    [theme.breakpoints.down('sm')]: {
      color: colors.lightPink,
    },
    '&:hover': {
      opacity: 0.7,
    },
  },
  physicalInfo: {
    fontSize: '12px',
    color: colors.brownText,
    margin: '2px 0',
  },
  descContainer: {
    margin: theme.spacing(1),
    overflow: 'hidden',
  },
  description: {
    color: colors.brown,
    margin: 0,
    fontSize: '14px',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 3,
    overflow: 'hidden',
  },
  tagList: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    margin: theme.spacing(1),
  },
  tag: {
    margin: '8px 4px 0 0',
    [theme.breakpoints.down('sm')]: {
      margin: '4px 4px 0 0',
    },
  },
  schedule: {
    padding: theme.spacing(2, 0, 0),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2, '2px', 0),
    },
  },
}));

const CastItem = React.memo<Props>(
  ({ cast, showTags, isSmRow = false, schedules, isActive = false }) => {
    const isSm = useMediaQuery('(max-width: 960px)');
    const classes = useStyles({ isSmRow });

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - 30);
    const isNewCast = targetDate < new Date(cast.joinedAt);

    const {
      height,
      bustSize,
      cupSize,
      waistSize,
      hipSize,
    } = cast.physicalInformation;
    return (
      <Paper
        className={clsx(classes.container, isActive && classes.active)}
        elevation={isSmRow && isSm ? 0 : 1}
      >
        {isActive && <div className={classes.activeLabel}>即ヒメ</div>}
        <Link href={`/casts/${cast.id}`} passHref>
          <a className={clsx(classes.link, classes.imageContainer)}>
            {isNewCast && (
              <img src="/cast_new_label.png" className={classes.newLabel} />
            )}
            <Image
              src={cast.imageUrl}
              width={400}
              height={isSm ? 480 : 500}
              objectFit="cover"
              className={classes.image}
            />
          </a>
        </Link>
        <div className={classes.castInfo}>
          <div className={classes.castInfoTop}>
            <div>
              <Link href={`/casts/${cast.id}`} passHref>
                <a className={classes.name}>{cast.name}</a>
              </Link>
              <p
                className={classes.physicalInfo}
              >{`T${height} / B${bustSize}(${cupSize}). W${waistSize}. H${hipSize}`}</p>
            </div>
            <ArrowRightIcon
              htmlColor={colors.border}
              fontSize="large"
              style={{
                marginLeft: isSm ? '-20px' : 0,
                marginRight: isSm ? '-10px' : 0,
              }}
            />
          </div>
          {(!isSm || isSmRow) && schedules === undefined && (
            <div className={classes.descContainer}>
              <p className={classes.description}>{cast.description}</p>
            </div>
          )}
          {showTags && (
            <div className={classes.tagList}>
              {cast.tags.map((tag) => (
                <div className={classes.tag} key={`tags-${tag}`}>
                  <TagItem title={tag} isOutlined={false} />
                </div>
              ))}
            </div>
          )}
          {schedules && (
            <div>
              {schedules.map((schedule) => (
                <div className={classes.schedule} key={schedule.id}>
                  <ScheduleItem
                    schedule={schedule}
                    youtubeChannelId={cast.youtubeChannelId}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Paper>
    );
  },
);

export default CastItem;
