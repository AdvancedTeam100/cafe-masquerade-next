import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { colors } from '@/config/ui';
import {
  getDateTimeString,
  getRelativeDateString,
  getTimeFromSeconds,
} from '@/libs/utils/dateFormat';
import { checkUserRole } from '@/libs/models/livestreaming';
import {
  Video,
  VideoRequiredRole,
  checkUserPermission,
} from '@/libs/models/video';
import RoleIcon from '@/components/common/RoleIcon';
import RestoreIcon from '@material-ui/icons/Restore';
import { UserRole, getUserRoleName } from '@/libs/models/user';
import { AdminRole, isAdmin } from '@/libs/models/adminUser';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(1, 0, 0),
    position: 'relative',
    overflow: 'hidden',
  },
  thumbContainer: {
    position: 'relative',
  },
  durationLabel: {
    position: 'absolute',
    color: 'white',
    fontWeight: 500,
    fontSize: '14px',
    background: '#00000091',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '2px 6px',
    borderRadius: '4px',
    lineHeight: '16px',
    bottom: '8px',
    right: '6px',
  },
  thumb: {
    width: '100%',
    borderRadius: '4px',
  },
  thumbLock: {
    width: '100%',
    borderRadius: '4px',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: colors.darkGray,
    opacity: 0.5,
  },
  videoTitle: {
    fontSize: '14px',
    color: colors.brownText,
    fontWeight: 700,
    margin: '4px 0',
    textDecoration: 'none',
    minHeight: 14,
    lineHeight: 1.4,
    position: 'relative',
    paddingRight: theme.spacing(1),
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 2,
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      '-webkit-line-clamp': 3,
    },
  },
  videoTitleIcon: {
    minWidth: '20px',
  },
  videoLink: {
    '&:hover': {
      opacity: 0.7,
    },
  },
  textContainer: {
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  },
  infoContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  roleLabel: {
    display: 'flex',
    alignItems: 'center',
    background: colors.backgroundBrown,
    padding: '0 2px',
    borderRadius: '2px',
    height: '18px',
    marginRight: '6px',
    [theme.breakpoints.down('sm')]: {
      background: '#866667ab',
      position: 'absolute',
      top: '8px',
      right: '0',
    },
    '& span': {
      color: 'white',
      fontSize: '12px',
      lineHeight: '12px',
    },
  },
  datetime: {
    display: 'flex',
    alignItems: 'center',
    color: colors.brownText,
  },
}));

const RequiredRoleLabel = React.memo<{ role: VideoRequiredRole | null }>(
  ({ role }) => {
    const classes = useStyles();
    switch (role) {
      case 'normal':
      case 'nonUser':
        return (
          <div className={classes.roleLabel}>
            <span>★ 全員</span>
          </div>
        );
      default:
        return (
          <div className={classes.roleLabel}>
            {role && <RoleIcon role={role} size={12} />}
            <span style={{ marginLeft: '4px' }}>
              {role ? `${getUserRoleName(role, true)}以上` : '選択なし'}
            </span>
          </div>
        );
    }
  },
);

type Props = {
  video: Video;
  currentUserRole: VideoRequiredRole | AdminRole;
};

const VideoListItem = React.memo<Props>(({ video, currentUserRole }) => {
  const classes = useStyles();
  const isSm = useMediaQuery('(max-width: 960px)');

  let isEnabledRole = false;
  let isEnabledExpired = false;

  if (video.requiredRole === 'nonUser') {
    isEnabledRole = true;
    isEnabledExpired = checkUserPermission({
      expiredAt: video.expiredAt,
      userRole: 'nonUser',
    });
  } else {
    isEnabledRole = checkUserRole({
      requiredRole: video.requiredRole as UserRole,
      userRole: currentUserRole as UserRole,
    });
    isEnabledExpired = checkUserPermission({
      expiredAt: video.expiredAt,
      userRole: currentUserRole,
    });
  }

  const expiredAt =
    !isAdmin(currentUserRole) && video.expiredAt
      ? video.expiredAt[currentUserRole as VideoRequiredRole]
      : null;

  return (
    <Grid container className={classes.container}>
      <Grid item xs={6} md={12} className={classes.thumbContainer}>
        <Link href={`/videos/${video.id}`} passHref>
          <a>
            <Image
              className={clsx(classes.thumb, classes.videoLink)}
              height={180}
              width={320}
              src={video.thumbnailUrl || '/default_thumbnail.png'}
            />
            {(!isEnabledRole || !isEnabledExpired) && (
              <div className={classes.thumbLock}></div>
            )}
          </a>
        </Link>
        {video.duration && (
          <div className={classes.durationLabel}>
            {getTimeFromSeconds(video.duration)}
          </div>
        )}
        {isSm && <RequiredRoleLabel role={video.requiredRole} />}
      </Grid>
      <Grid item xs={6} md={12} className={classes.textContainer}>
        <Link href={`/videos/${video.id}`} passHref>
          <a className={clsx(classes.videoTitle, classes.videoLink)}>
            {video.title}
          </a>
        </Link>
        <div className={classes.infoContainer}>
          {!isSm && <RequiredRoleLabel role={video.requiredRole} />}
          <span className={classes.datetime}>
            {getRelativeDateString({
              targetTime: video.publishedAt,
              suffix: '前',
            })}
            に{video.wasLivestreaming ? '配信' : '投稿'}
          </span>
          {expiredAt && (
            <span className={classes.datetime}>
              {isSm ? (
                <RestoreIcon fontSize="small" style={{ marginRight: '4px' }} />
              ) : (
                '視聴期限：'
              )}
              {getDateTimeString(expiredAt)}
            </span>
          )}
        </div>
      </Grid>
    </Grid>
  );
});

export default VideoListItem;
