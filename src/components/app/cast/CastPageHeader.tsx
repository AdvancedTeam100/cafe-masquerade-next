import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '@/config/ui';
import { Cast } from '@/libs/models/cast';
import { getDateStringJa } from '@/libs/utils/dateFormat';

type Props = {
  cast: Cast;
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1, 0, 1),
    display: 'flex',
    alignItems: 'center',
    borderTop: `1px solid ${colors.border}`,
    borderBottom: `1px solid ${colors.border}`,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 0, 1),
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    position: 'relative',
  },
  title: {
    color: colors.brown,
    fontWeight: 700,
    fontSize: '18px',
    margin: theme.spacing(0.5, 0),
  },
  info: {
    color: colors.brown,
    fontWeight: 700,
    margin: theme.spacing(0, 2),
    [theme.breakpoints.down('sm')]: {
      fontWeight: 500,
      opacity: 0.5,
      margin: theme.spacing(0, 0),
      fontSize: '12px',
    },
  },
  newLabel: {
    position: 'absolute',
    width: '40px',
    [theme.breakpoints.up('md')]: {
      width: '60px',
    },
    zIndex: 100,
    top: 0,
    right: 0,
  },
}));

const CastPageHeader = React.memo<Props>(({ cast }) => {
  const classes = useStyles();

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - 30);
  const isNewCast = targetDate < new Date(cast.joinedAt);

  const {
    height,
    bustSize,
    cupSize,
    waistSize,
    hipSize,
  } = cast.physicalInformation;
  return (
    <div className={classes.container}>
      <h1 className={classes.title}>{cast.name}</h1>
      <span className={classes.info}>
        {`身長：${height} / バスト：${bustSize}(${cupSize}) / ウエスト：${waistSize} / ヒップ：${hipSize}`}
      </span>
      <span className={classes.info}>
        {`入店日：${getDateStringJa(cast.joinedAt)}`}
      </span>
      {isNewCast && (
        <img src="/cast_new_label.png" className={classes.newLabel} />
      )}
    </div>
  );
});

export default CastPageHeader;
