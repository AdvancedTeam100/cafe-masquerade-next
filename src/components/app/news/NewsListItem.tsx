import React from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ErrorIcon from '@material-ui/icons/Error';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { colors } from '@/config/ui';
import { News } from '@/libs/models/news';
import { getDateStringDots } from '@/libs/utils/dateFormat';
import TagItem from '@/components/app/common/TagItem';

type Props = {
  news: News;
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1),
    },
  },
  bodyContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${colors.border}`,
    padding: theme.spacing(2, 0, 2, 2),
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(2),
    },
  },
  infoIcon: {
    width: '35px',
    [theme.breakpoints.down('sm')]: {
      width: '12px',
    },
  },
  newsContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  linkTitle: {
    fontSize: '14px',
    padding: '2px 0',
    color: colors.brownText,
    textDecoration: 'none',
    fontWeight: 700,
    '&:hover': {
      opacity: 0.7,
    },
  },
  date: {
    color: colors.lightPink,
    fontSize: '14px',
  },
}));

const NewsListItem = React.memo<Props>(({ news }) => {
  const isSm = useMediaQuery('(max-width: 960px)');
  const classes = useStyles();
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - 7);
  const isLatest = targetDate < new Date(news.publishedAt);
  return (
    <div className={classes.container}>
      <div className={classes.infoIcon}>
        {isLatest && (
          <ErrorIcon
            htmlColor={colors.vividPink}
            fontSize={isSm ? 'small' : 'large'}
          />
        )}
      </div>
      <div className={classes.bodyContainer}>
        <div className={classes.newsContent}>
          <div>
            {news.tags.map((tag) => (
              <TagItem
                key={`${news.id}-${tag}`}
                title={tag}
                href={`/news/tags/${tag}`}
              />
            ))}
          </div>
          <Link href={`/news/${news.id}`}>
            <a href={`/news/${news.id}`} className={classes.linkTitle}>
              {news.title}
            </a>
          </Link>
          <time dateTime={news.publishedAt} className={classes.date}>
            {getDateStringDots(news.publishedAt)}
          </time>
        </div>
        <ArrowRightIcon htmlColor={colors.border} fontSize="large" />
      </div>
    </div>
  );
});

export default NewsListItem;
