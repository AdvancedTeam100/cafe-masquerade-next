import React from 'react';
import { Theme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles<
  Theme,
  { headerHeight: number; headerHeightSm: number; footerHeight: number }
>((theme) => ({
  wrapper: {
    backgroundImage: 'url("/app_background.png")',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    [theme.breakpoints.down('sm')]: {
      minHeight: ({ headerHeightSm, footerHeight }) =>
        `calc(100vh - ${headerHeightSm}px - ${footerHeight}px)`,
    },
    [theme.breakpoints.up('md')]: {
      minHeight: ({ headerHeight, footerHeight }) =>
        `calc(100vh - ${headerHeight}px - ${footerHeight}px)`,
    },
  },
}));

type Props = {
  headerHeight: number;
  headerHeightSm: number;
  footerHeight: number;
};

const Wrapper: React.FC<Props> = ({
  headerHeight,
  headerHeightSm,
  footerHeight,
  children,
}) => {
  const classes = useStyles({ headerHeight, headerHeightSm, footerHeight });
  return <div className={classes.wrapper}>{children}</div>;
};

export default Wrapper;
