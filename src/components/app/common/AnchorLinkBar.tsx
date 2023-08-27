import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '@/config/ui';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const useStyles = makeStyles((theme) => ({
  link: {
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeft: `16px solid ${colors.lightPink}`,
    background: colors.backgroundWhite,
    textDecoration: 'none',
    padding: '4px 0',
    '&:hover': {
      opacity: 0.7,
    },
  },
  title: {
    marginLeft: theme.spacing(2),
    fontWeight: 500,
    fontSize: '14px',
    color: colors.brown,
  },
  subTitle: {
    color: colors.brown,
    fontWeight: 700,
    opacity: '0.5',
    fontSize: '12px',
    fontFamily: '"Libre Baskerville", serif',
    whiteSpace: 'nowrap',
    marginLeft: theme.spacing(0.5),
  },
}));

type Props = {
  title: string;
  subTitle: string;
  href: string;
};

const AnchorLinkBar = React.memo<Props>(({ title, subTitle, href }) => {
  const classes = useStyles();
  return (
    <a href={href} className={classes.link}>
      <div>
        <span className={classes.title}>{title}</span>
        <span className={classes.subTitle}>{subTitle}</span>
      </div>
      <ArrowRightIcon htmlColor={colors.border} fontSize="large" />
    </a>
  );
});

export default AnchorLinkBar;
