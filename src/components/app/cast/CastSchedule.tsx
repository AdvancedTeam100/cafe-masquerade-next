import { colors } from '@/config/ui';
import { useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Image from 'next/image';
import React from 'react';
import Slider, { CustomArrowProps } from 'react-slick';

type Schedule = {
  date: string;
  events: {
    at: string;
    isHoliday: boolean;
    label: string | null;
  }[];
};

type Props = {
  schedules: Schedule[];
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('md')]: {
      overflowX: 'auto',
    },
  },
  slideWrapper: {
    width: 'calc(100%)',
    '& .slick-list': {
      [theme.breakpoints.down('sm')]: {
        borderTop: `1px dashed ${colors.gray}`,
      },
      [theme.breakpoints.up('md')]: {
        borderTop: `1px solid ${colors.gray}`,
        borderBottom: `1px solid ${colors.gray}`,
      },
    },
    '& .slick-slider': {
      [theme.breakpoints.up('md')]: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      },
    },
    '& .slick-slide': {
      [theme.breakpoints.down('sm')]: {
        width: '100% !important',
      },
    },
    '& .slick-track': {
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
      },
    },
    '& .slick-dots': {
      [theme.breakpoints.down('sm')]: {
        bottom: '-40px',
        position: 'initial',
      },
    },
    '& .slick-dots li': {
      [theme.breakpoints.down('sm')]: {
        width: '30px',
        height: '30px',
        top: '24px',
      },
    },
    '& li.slick-active': {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  },
  halfItemWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 1px',
    [theme.breakpoints.down('sm')]: {
      display: 'flex !important',
      flexDirection: 'row',
      borderBottom: `1px dashed ${colors.gray}`,
    },
    [theme.breakpoints.up('md')]: {
      width: 'calc(100% / 7)',
    },
  },
  itemHeader: {
    color: colors.brown,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1, 0),
    [theme.breakpoints.down('sm')]: {
      width: '120px',
      padding: theme.spacing(1, 0),
    },
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2, 0),
    color: colors.brown,
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: theme.spacing(1, 0),
    },
  },
  itemContentChild: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.brown,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
    },
  },
  contentText: {
    margin: '4px 0',
  },
  contentLabel: {
    marginTop: '-8px',
    color: colors.hoverPink,
    fontSize: '12px',
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
      marginLeft: '4px',
    },
  },
  arrowContainer: {
    cursor: 'pointer',
    height: '30px',
    width: '30px',
    opacity: '0.8',
  },
  arrowIcon: {
    width: '30px',
    height: '30px',
  },
}));

const Arrow = React.memo(
  ({
    onClick,
    currentSlide,
    type,
    isSm,
  }: CustomArrowProps & { type: 'prev' | 'next' } & { isSm: boolean }) => {
    const classes = useStyles();

    return (
      <div
        className={classes.arrowContainer}
        onClick={onClick}
        hidden={
          (currentSlide === 0 && type === 'prev') ||
          (currentSlide !== 0 && type === 'next') ||
          isSm
        }
      >
        <Image
          src={`/icon_${type}_arrow.png`}
          width={30}
          height={30}
          layout="fixed"
          className={classes.arrowIcon}
        />
      </div>
    );
  },
);

const imageUrls = ['/icon_prev_arrow.png', '/icon_next_arrow.png'];

const CastSchedule = React.memo<Props>(({ schedules }) => {
  const classes = useStyles();
  const isSm = useMediaQuery('(max-width: 960px)');

  return (
    <div className={classes.container}>
      <div className={classes.slideWrapper}>
        <Slider
          dots={isSm ? true : false}
          infinite={false}
          speed={500}
          slidesToShow={isSm ? 1 : 7}
          slidesToScroll={isSm ? 1 : 7}
          arrows={true}
          rows={isSm ? 7 : 1}
          nextArrow={<Arrow type={'next'} isSm={isSm} />}
          prevArrow={<Arrow type={'prev'} isSm={isSm} />}
          customPaging={(i) => (
            <img
              className={classes.arrowIcon}
              src={imageUrls[i]}
              alt={'arrow'}
            />
          )}
        >
          {schedules.map((schedule) => (
            <div className={classes.item} key={schedule.date}>
              <div
                className={classes.itemHeader}
                style={{
                  background: schedule.date.includes('(土)')
                    ? '#BCDDFF'
                    : schedule.date.includes('(日)')
                    ? '#FFBCBC'
                    : colors.backgroundGray,
                }}
              >
                {schedule.date}
              </div>
              <div className={classes.itemContent}>
                {schedule.events.length > 0 ? (
                  schedule.events.map((event, i) => (
                    <div
                      key={`event-${i}`}
                      className={classes.itemContentChild}
                    >
                      {(event.isHoliday || event.at) && (
                        <span className={classes.contentText}>
                          {event.isHoliday ? 'お休み' : `${event.at}~`}
                        </span>
                      )}
                      {event.label && (
                        <span className={classes.contentLabel}>
                          {event.label}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <span className={classes.contentText}>出勤調整中</span>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
});

export default CastSchedule;
