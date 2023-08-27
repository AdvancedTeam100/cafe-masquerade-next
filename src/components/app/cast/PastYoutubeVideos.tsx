import React from 'react';
import Image from 'next/image';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { YoutubeVideo } from '@/libs/models/youtubeVideo';
import { useThumbnail } from '@/hooks/thumbnail';

type Props = {
  youtubeVideos: YoutubeVideo[];
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
  itemContainer: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0),
    },
  },
  item: {
    display: 'block',
    width: '100%',
    '& div': {
      width: '100%',
    },
  },
  itemThumb: {
    '&:hover': {
      opacity: 0.7,
    },
  },
}));

const PastYoutubeVideo = React.memo<{ youtubeVideo: YoutubeVideo }>(
  ({ youtubeVideo }) => {
    const classes = useStyles();
    const thumb = useThumbnail('YouTube', youtubeVideo?.thumbnails, undefined);
    return (
      <a
        className={classes.item}
        href={`https://www.youtube.com/watch?v=${youtubeVideo.id}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        <Image
          className={classes.itemThumb}
          width={480}
          height={270}
          src={thumb.url}
          objectFit="cover"
        />
      </a>
    );
  },
);

const PastYoutubeVideos = React.memo<Props>(({ youtubeVideos }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Grid container className={classes.itemContainer} spacing={1}>
        {youtubeVideos.map((video, i) => (
          <Grid item key={video.id} xs={i === 0 ? 12 : 6} sm={4}>
            <PastYoutubeVideo youtubeVideo={video} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
});

export default PastYoutubeVideos;
