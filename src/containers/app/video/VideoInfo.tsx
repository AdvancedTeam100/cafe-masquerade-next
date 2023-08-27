import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import { getRelativeDateString } from '@/libs/utils/dateFormat';
import { colors } from '@/config/ui';
import LinkableParagraph from '@/components/common/LinkableParagraph';
import { Video } from '@/libs/models/video';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      borderRadius: '12px',
      padding: theme.spacing(2, 0),
      overflowY: 'auto',
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: '0 0 12px 12px',
      padding: theme.spacing(2, 0),
      overflowY: 'hidden',
    },
    '-webkit-overflow-scrolling': 'touch',
  },
  title: {
    color: colors.brown,
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(0, 4),
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0, 2),
    },
    fontWeight: 700,
    fontSize: '18px',
  },
  time: {
    color: colors.brown,
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(0, 4),
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0, 2),
    },
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    fontSize: '14px',
  },
  divider: {
    backgroundColor: colors.border,
    margin: theme.spacing(0, 2),
  },
  description: {
    color: colors.brown,
    whiteSpace: 'pre-line',
    wordBreak: 'break-word',
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(4),
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(2),
    },
    fontSize: '14px',
    lineHeight: '1.4rem',
  },
}));

type Props = {
  video: Video;
};

const VideoInfo: React.FC<Props> = ({ video }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.container} elevation={0}>
      <h2 className={classes.title}>{video.title}</h2>
      <p className={classes.time}>
        {getRelativeDateString({
          targetTime: video.publishedAt,
          showDate: true,
          suffix: '前',
        })}
        に{video.wasLivestreaming ? 'ライブ配信' : '投稿'}
      </p>
      <Divider className={classes.divider} />
      <LinkableParagraph
        sentence={video.description}
        className={classes.description}
      />
    </Paper>
  );
};

export default VideoInfo;
