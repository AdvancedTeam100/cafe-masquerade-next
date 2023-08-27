import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '@/config/ui';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  leftBorder: {
    width: '50px',
    height: '24px',
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      minWidth: '20px',
      marginRight: theme.spacing(1),
    },
  },
  border: {
    height: '2px',
    width: '100%',
    margin: theme.spacing('4px', 0),
    backgroundColor: colors.border,
  },
  text: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'flex-end',
    lineHeight: '16px',
  },
  title: {
    fontSize: '18px',
    wordBreak: 'keep-all',
    margin: 0,
    height: '22px',
    fontWeight: 700,
  },
  subTitle: {
    color: colors.brown,
    fontWeight: 700,
    opacity: '0.5',
    fontSize: '12px',
    fontFamily: '"Libre Baskerville", serif',
    whiteSpace: 'nowrap',
    marginLeft: theme.spacing(0.5),
    lineHeight: '20px',
  },
  rightBorder: {
    marginLeft: theme.spacing(2),
    width: '100%',
    height: '24px',
  },
}));

type Props = {
  title: string;
  subTitle: string;
  customColor?: string;
};

const SectionTitle = React.memo<Props>(({ title, subTitle, customColor }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.leftBorder}>
        <div className={classes.border} />
        <div className={classes.border} />
        <div className={classes.border} />
      </div>
      <div className={classes.text}>
        <h3
          className={classes.title}
          style={{ color: customColor ?? colors.brown }}
        >
          {title}
        </h3>
        <span className={classes.subTitle}>{subTitle}</span>
      </div>
      <div className={classes.rightBorder}>
        <div className={classes.border} />
        <div className={classes.border} />
        <div className={classes.border} />
      </div>
    </div>
  );
});

export default SectionTitle;
