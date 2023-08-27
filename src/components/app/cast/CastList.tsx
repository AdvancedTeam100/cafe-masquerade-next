import { Cast } from '@/libs/models/cast';
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
  castContainer: {
    padding: theme.spacing(2, 7),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0),
    },
  },
  castItem: {
    marginBottom: '16px',
  },
}));

type Props = {
  breakpointsCols: number;
  casts: Cast[];
  isSmRow: boolean;
};

const CastList = React.memo<Props>(({ breakpointsCols, casts, isSmRow }) => {
  const classes = useStyles();
  return (
    <Masonry
      breakpointCols={breakpointsCols}
      className={classes.wrapper}
      columnClassName={classes.wrapperColumn}
    >
      {casts.map((cast) => (
        <div className={classes.castItem} key={`schedule-${cast.id}`}>
          <CastItem cast={cast} showTags={true} isSmRow={isSmRow} />
        </div>
      ))}
    </Masonry>
  );
});

export default CastList;
