import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '@/config/ui';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3, 0),
  },
  linkContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  pageInfo: {
    color: colors.brownText,
    fontWeight: 700,
  },
  pageContainer: {
    padding: theme.spacing(1),
  },
  arrow: {
    padding: theme.spacing(1),
    textDecoration: 'none',
    color: colors.brownText,
    fontWeight: 700,
    '&:hover': {
      opacity: 0.7,
    },
  },
  disableArrow: {
    padding: theme.spacing(1),
    color: colors.lightPink,
    fontWeight: 700,
  },
  page: {
    textDecoration: 'none',
    color: colors.brownText,
    fontWeight: 700,
    '&:hover': {
      opacity: 0.7,
    },
  },
  activePage: {
    color: colors.pink,
    fontWeight: 700,
  },
}));

type Props = {
  currentPage: number;
  totalCount: number;
  perPageCount: number;
  href: string;
};

const Pagination = React.memo<Props>(
  ({ currentPage, totalCount, perPageCount, href }) => {
    const classes = useStyles();
    const pageLength = Math.ceil(totalCount / perPageCount);

    return (
      <div className={classes.container}>
        <span className={classes.pageInfo}>
          {`${(currentPage - 1) * perPageCount + 1}~${
            currentPage === pageLength ? totalCount : currentPage * perPageCount
          }件／${totalCount}件中`}
        </span>
        <div className={classes.linkContainer}>
          {currentPage > 1 ? (
            <Link href={`${href}/${currentPage - 1}`}>
              <a href={`${href}/${currentPage - 1}`} className={classes.arrow}>
                {'〈前へ'}
              </a>
            </Link>
          ) : (
            <span className={classes.disableArrow}>{'〈前へ'}</span>
          )}
          {[...Array(pageLength).keys()].map((number) => {
            const page = number + 1;
            if (pageLength > 6 && page > 4 && page < pageLength) {
              return page < 8 ? (
                <span className={clsx(classes.page, classes.activePage)}>
                  .
                </span>
              ) : (
                <></>
              );
            }
            return (
              <div
                className={classes.pageContainer}
                key={`pagination-${number + 1}`}
              >
                {page === currentPage ? (
                  <span className={clsx(classes.page, classes.activePage)}>
                    {page}
                  </span>
                ) : (
                  <Link href={`${href}/${page}`}>
                    <a href={`${href}/${page}`} className={classes.page}>
                      {page}
                    </a>
                  </Link>
                )}
              </div>
            );
          })}
          {currentPage < pageLength ? (
            <Link href={`${href}/${currentPage + 1}`}>
              <a href={`${href}/${currentPage + 1}`} className={classes.arrow}>
                {'次へ〉'}
              </a>
            </Link>
          ) : (
            <span className={classes.disableArrow}>{'次へ〉'}</span>
          )}
        </div>
      </div>
    );
  },
);

export default Pagination;
