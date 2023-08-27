import React, { DOMAttributes } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '@/config/ui';

const useStyles = makeStyles((theme) => ({
  content: {
    color: colors.brown,
    fontWeight: 500,
    wordBreak: 'break-all',
    '& h2': {
      borderBottom: `2px solid ${colors.lightPink}`,
      paddingBottom: theme.spacing(1),
    },
    '& h3': {
      borderBottom: `1px solid ${colors.border}`,
      paddingBottom: theme.spacing(1),
    },
    '& h4': {
      borderBottom: `1px solid ${colors.borderSecondary}`,
      paddingBottom: theme.spacing(1),
    },
    '& p': {
      margin: theme.spacing(3, 0),
      lineHeight: '1.8rem',
      fontSize: '16px',
    },
    '& a': {
      color: colors.linkText,
    },
    '& img': {
      maxWidth: '100%',
      objectFit: 'contain',
      [theme.breakpoints.down('sm')]: {
        height: 'inherit !important',
      },
    },
    '& ul': {
      listStyleImage: 'url("/svg/list_icon.svg")',
    },
  },
}));

type Props = DOMAttributes<HTMLDivElement>;

const TextContent = React.memo<Props>(({ children, ...props }) => {
  const classes = useStyles();
  return (
    <div className={classes.content} {...props}>
      {children}
    </div>
  );
});

export default TextContent;
