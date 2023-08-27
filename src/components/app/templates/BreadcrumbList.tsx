import React from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '@/config/ui';

export type Breadcrumb = {
  child?: {
    title: string;
    href?: string;
  };
  grandChild?: {
    title: string;
    href?: string;
  };
};

type Props = {
  breadcrumb: Breadcrumb;
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  link: {
    textDecoration: 'none',
    color: colors.brownText,
    fontWeight: 500,
    '&:hover': {
      opacity: 0.7,
    },
  },
  text: {
    color: colors.brownText,
    fontWeight: 500,
  },
  arrow: {
    color: colors.brownText,
    margin: theme.spacing(0, 1),
  },
}));

const BreadcrumbList = React.memo<Props>(({ breadcrumb }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Link href={'/'}>
        <a href="/" className={classes.link}>
          ますかれーどオフィシャルサイト
        </a>
      </Link>
      {breadcrumb?.child && (
        <>
          <span className={classes.arrow}>{'>'}</span>
          {breadcrumb.child.href ? (
            <Link href={breadcrumb.child.href}>
              <a href={breadcrumb.child.href} className={classes.link}>
                {breadcrumb.child.title}
              </a>
            </Link>
          ) : (
            <span className={classes.text}>{breadcrumb.child.title}</span>
          )}
        </>
      )}
      {breadcrumb?.grandChild && (
        <>
          <span className={classes.arrow}>{'>'}</span>
          {breadcrumb.grandChild.href ? (
            <Link href={breadcrumb.grandChild.href}>
              <a href={breadcrumb.grandChild.href} className={classes.link}>
                {breadcrumb.grandChild.title}
              </a>
            </Link>
          ) : (
            <span className={classes.text}>{breadcrumb.grandChild.title}</span>
          )}
        </>
      )}
    </div>
  );
});

export default BreadcrumbList;
