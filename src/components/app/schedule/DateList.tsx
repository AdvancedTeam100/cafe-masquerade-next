import React from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '@/config/ui';
import { getDateWithDay } from '@/libs/utils/dateFormat';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    overflowX: 'auto',
    padding: '4px 0',
    whiteSpace: 'nowrap',
  },
  item: {
    borderRight: `1px solid ${colors.border}`,
    borderTop: `1px solid ${colors.border}`,
    borderBottom: `1px solid ${colors.border}`,
    borderLeft: `1px solid ${colors.border}`,
    background: colors.backgroundYellow,
    display: 'inline-block',
    color: colors.brown,
    fontWeight: 700,
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
    [theme.breakpoints.down('sm')]: {
      width: '84px',
      padding: theme.spacing(1.6, 0),
    },
    [theme.breakpoints.up('md')]: {
      width: 'calc(100% / 7)',
      padding: theme.spacing(2, 0),
    },
  },
  active: {
    position: 'relative',
    border: `2px solid ${colors.lightPink}`,
    color: colors.lightPink,
    boxShadow: '2px 2px 2px 1px rgba(0, 0, 0, 0.2)',
    cursor: 'initial',
    '&:hover': {
      opacity: 1,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.8, 0),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(2.4, 0),
    },
  },
}));

type Props = {
  currentDate: string;
  dateList: string[];
};

const DateList = React.memo<Props>(({ currentDate, dateList }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {dateList.map((date, i) => (
        <Link href={i === 0 ? '/schedules' : `/schedules/${date}`} key={date}>
          <a>
            <div
              className={clsx(
                classes.item,
                date === currentDate && classes.active,
              )}
            >
              {getDateWithDay(date)}
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
});

export default DateList;
