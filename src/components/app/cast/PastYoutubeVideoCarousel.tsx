import React from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import { makeStyles } from '@material-ui/core/styles';
import { YoutubeVideo } from '@/libs/models/youtubeVideo';
import { useThumbnail } from '@/hooks/thumbnail';

type Props = {
  youtubeVideos: YoutubeVideo[];
};

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(2, -4, 0),
  },
  item: {
    padding: theme.spacing(1, 1, 0),
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
    const thumb = useThumbnail('YouTube', youtubeVideo?.thumbnails);
    return (
      <a
        className={classes.item}
        href={`https://www.youtube.com/watch?v=${youtubeVideo.id}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        <Image
          className={classes.itemThumb}
          height={thumb.height}
          width={thumb.width}
          src={thumb.url}
        />
      </a>
    );
  },
);

const PastYoutubeVideoCarousel = React.memo<Props>(({ youtubeVideos }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Slider
        arrows={false}
        dots={false}
        autoplay={true}
        infinite={true}
        centerMode={true}
        speed={3000}
        autoplaySpeed={3000}
        slidesToShow={3}
        slidesToScroll={1}
        cssEase="linear"
      >
        {youtubeVideos.map((video) => (
          <PastYoutubeVideo youtubeVideo={video} key={video.id} />
        ))}
      </Slider>
    </div>
  );
});

export default PastYoutubeVideoCarousel;
