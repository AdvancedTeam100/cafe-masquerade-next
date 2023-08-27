import React from 'react';
import Link from 'next/link';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { colors } from '@/config/ui';
import clsx from 'clsx';

const useStyles = makeStyles<Theme, { isOutlined: boolean }>(() => ({
  tagItem: {
    fontWeight: 700,
    borderRadius: '6px',
    color: ({ isOutlined }) => (isOutlined ? colors.lightPink : 'white'),
    background: ({ isOutlined }) => (isOutlined ? 'inherit' : colors.lightPink),
    border: `1px solid ${colors.lightPink}`,
    padding: '0px 8px',
    textDecoration: 'none',
    marginRight: '3px',
    marginTop: '3px',
    fontSize: '12px',
  },
  linkText: {
    '&:hover': {
      opacity: 0.7,
    },
  },
}));

type Props = {
  title: string;
  isOutlined?: boolean;
  href?: string;
};

const TagItem = React.memo<Props>(({ title, isOutlined = false, href }) => {
  const classes = useStyles({ isOutlined });

  return href ? (
    <Link href={href}>
      <a href={href} className={clsx(classes.tagItem, classes.linkText)}>
        {title}
      </a>
    </Link>
  ) : (
    <span className={classes.tagItem}>{title}</span>
  );
});

export default TagItem;
