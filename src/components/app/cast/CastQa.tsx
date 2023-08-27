import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '@/config/ui';
import { Cast } from '@/libs/models/cast';

type Props = {
  qa: Cast['qa'];
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    [theme.breakpoints.down('sm')]: {},
    [theme.breakpoints.up('md')]: {},
  },
  item: {
    display: 'flex',
    borderBottom: `1px dashed ${colors.gray}`,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      margin: theme.spacing(0, 2),
      padding: theme.spacing(1, 0),
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      padding: theme.spacing(2, 0),
    },
  },
  itemQuestion: {
    color: colors.hoverPink,
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(2),
      minWidth: '130px',
    },
  },
  itemAnswer: {
    color: colors.brown,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5, 0, 1),
    },
  },
  contentText: {
    margin: '4px 0',
  },
}));

const CastQa = React.memo<Props>(({ qa }) => {
  const classes = useStyles();
  const isSm = useMediaQuery('(max-width: 960px)');
  return (
    <div className={classes.container}>
      {qa.map((item) => (
        <div className={classes.item} key={item.question}>
          <div className={classes.itemQuestion}>Q.{item.question}</div>
          <div className={classes.itemAnswer}>
            {!isSm && '：'}
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  );
});

export default CastQa;
