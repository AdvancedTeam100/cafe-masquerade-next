import React from 'react';
import Image from 'next/image';
import Slider, { CustomArrowProps, Settings } from 'react-slick';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { colors } from '@/config/ui';

const useStyles = makeStyles<Theme, { darkBackground: boolean }>(() => ({
  dots: {
    bottom: '-24px !important',
    '& li': {
      width: '12px !important',
      height: '12px !important',
      margin: '0 3px !important',
    },
    '& li.slick-active button::before': {
      color: `${colors.vividPink} !important`,
    },
  },
  thumbDots: {
    display: 'flex !important',
    width: '100% !important',
    overflowX: 'auto',
    bottom: '-88px !important',
    '-ms-overflow-style': 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '& li': {
      minWidth: '100px',
      width: '100px !important',
      height: '75px !important',
      backgroundColor: ({ darkBackground }) =>
        darkBackground ? colors.backgroundDark : colors.backgroundWhite,
      borderRadius: '8px',
    },
    '& li div': {
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    '& li.slick-active div': {
      backgroundColor: 'rgba(0,0,0,0)',
    },
  },
  link: {
    '&:hover': {
      opacity: 0.7,
    },
    '& div': {
      backgroundColor: ({ darkBackground }) =>
        darkBackground ? colors.backgroundDark : colors.backgroundWhite,
    },
  },
  image: {
    backgroundColor: ({ darkBackground }) =>
      darkBackground ? colors.backgroundDark : colors.backgroundWhite,
  },
  imagePaging: {
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100%',
    borderRadius: '8px',
  },
  imagePagingFilter: {
    height: '100%',
    borderRadius: '8px',
  },
}));

const useArrowStyles = makeStyles((theme) => ({
  nextArrow: {
    [theme.breakpoints.up('md')]: {
      backgroundImage: 'url("/carousel_next.png") !important',
      position: 'absolute',
      top: '40%',
      right: 0,
      zIndex: 100,
      cursor: 'pointer',
      height: '100px',
      width: '50px',
      backgroundSize: 'contain',
    },
  },
  prevArrow: {
    [theme.breakpoints.up('md')]: {
      backgroundImage: 'url("/carousel_prev.png") !important',
      position: 'absolute',
      top: '40%',
      left: 0,
      zIndex: 100,
      cursor: 'pointer',
      height: '100px',
      width: '50px',
      backgroundSize: 'contain',
    },
  },
}));

type Props = {
  images: {
    url: string;
    href?: string;
  }[];
  width: number;
  height: number;
  arrows?: boolean;
  imagePaging?: boolean;
  darkBackground?: boolean;
  objectFit?: 'cover' | 'contain';
};

const SliderArrow = React.memo(
  ({ onClick, type }: CustomArrowProps & { type: 'prev' | 'next' }) => {
    const classes = useArrowStyles();
    return (
      <div
        className={type === 'next' ? classes.nextArrow : classes.prevArrow}
        onClick={onClick}
      />
    );
  },
);

const Carousel = React.memo<Props>(
  ({
    images,
    width,
    height,
    imagePaging,
    arrows = false,
    darkBackground = false,
    objectFit = 'contain',
  }) => {
    const classes = useStyles({ darkBackground });

    const customSetting: Settings = {
      dotsClass: `slick-dots ${classes.dots}`,
    };
    if (imagePaging) {
      customSetting.customPaging = (i) => (
        <a>
          <div
            className={classes.imagePaging}
            style={{ backgroundImage: `url(${images[i]?.url})` }}
          >
            <div className={classes.imagePagingFilter}></div>
          </div>
        </a>
      );
      customSetting.dotsClass = `slick-dots ${classes.thumbDots}`;
    }
    return (
      <Slider
        dots={true}
        autoplay={true}
        infinite={true}
        speed={500}
        autoplaySpeed={5000}
        slidesToShow={1}
        slidesToScroll={1}
        arrows={arrows}
        nextArrow={<SliderArrow type="next" />}
        prevArrow={<SliderArrow type="prev" />}
        {...customSetting}
      >
        {images.map((image) =>
          image.href ? (
            <a
              className={classes.link}
              href={image.href}
              target="_blank"
              rel="noreferrer noopener"
              key={image.url}
            >
              <Image
                className={classes.image}
                src={image.url}
                width={width}
                height={height}
                objectFit={objectFit}
                objectPosition="center"
                layout="responsive"
                priority={true}
              />
            </a>
          ) : (
            <Image
              className={classes.image}
              src={image.url}
              width={width}
              height={height}
              objectFit={objectFit}
              objectPosition="center"
              layout="responsive"
              priority={true}
              key={image.url}
            />
          ),
        )}
      </Slider>
    );
  },
);

export default Carousel;
