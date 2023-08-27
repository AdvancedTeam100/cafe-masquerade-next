import { Cast } from '@/libs/models/cast';
import { Schedule } from '@/libs/models/schedule';
import { makeStyles } from '@material-ui/core';
import React from 'react';
import Masonry from 'react-masonry-css';
import CastItem from './CastItem';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    marginLeft: '-30px',
    width: 'auto',
    [theme.breakpoints.down('sm')]: {
      padding: '0',
      paddingLeft: '20px',
    },
  },
  wrapperColumn: {
    paddingLeft: '30px',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: '10px',
    },
  },
  castItem: {
    marginBottom: '16px',
  },
}));

type Props = {
  breakpointsCols: number;
  castSchedules: {
    cast: Cast;
    schedules: Schedule[];
    isActive: boolean;
  }[];
};

const CastScheduleList = React.memo<Props>(
  ({ breakpointsCols, castSchedules }) => {
    const classes = useStyles();
    return (
      <Masonry
        breakpointCols={breakpointsCols}
        className={classes.wrapper}
        columnClassName={classes.wrapperColumn}
      >
        {castSchedules.map(({ cast, schedules, isActive }) => (
          <div className={classes.castItem} key={`schedule-${cast.id}`}>
            <CastItem
              cast={cast}
              showTags={false}
              schedules={schedules}
              isActive={isActive}
            />
          </div>
        ))}
      </Masonry>
    );
  },
);

export default CastScheduleList;
