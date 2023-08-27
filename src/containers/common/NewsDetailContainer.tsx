import TagItem from '@/components/app/common/TagItem';
import TextContent from '@/components/app/common/TextContent';
import TweetItemList from '@/components/app/common/TweetItemList';
import { button, colors } from '@/config/ui';
import { HomeContent } from '@/libs/models/content';
import { News } from '@/libs/models/news';
import { getDateString, getDateStringDots } from '@/libs/utils/dateFormat';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { TwitterShareButton } from 'react-share';
import TwitterIcon from '@material-ui/icons/Twitter';
import Link from 'next/link';
import { CircularProgress } from '@material-ui/core';
import Template from '../app/Template';

const useStyles = makeStyles((theme) => ({
  loader: {
    margin: '32px auto',
    textAlign: 'center',
  },
  newsContainer: {
    padding: theme.spacing(2, 5),
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(1),
    },
  },
  newsHeader: {
    padding: theme.spacing(1, 0, 2),
    borderBottom: `3px solid ${colors.border}`,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 0, 1),
    },
  },
  newsTitle: {
    color: colors.brown,
    fontWeight: 700,
    fontSize: '18px',
    margin: theme.spacing(0.5, 0),
  },
  newsTime: {
    color: colors.brown,
    fontSize: '12px',
  },
  newsImageContainer: {
    padding: theme.spacing(2, 0),
    width: '100%',
  },
  newsImage: {
    width: '100%',
  },
  newsContent: {
    padding: theme.spacing(0, 0, 2),
  },
  newsTagContainer: {
    borderTop: `3px solid ${colors.border}`,
    marginTop: theme.spacing(1),
    padding: theme.spacing(2, 0),
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    '& a': {
      marginRight: theme.spacing(1),
    },
  },
  text: {
    fontWeight: 500,
    color: colors.brown,
    padding: '2px 0',
  },
  tweetButton: {
    backgroundColor: `${colors.twitterBlue} !important`,
    color: '#fff !important',
    fontSize: '12px !important',
    lineHeight: '16px !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    padding: '2px 6px !important',
    '& svg': {
      fontSize: '14px',
    },
  },
  newsListContainer: {
    padding: theme.spacing(2, 0),
  },
  newsItem: {
    padding: theme.spacing('10px', 0),
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    '& a': {
      textDecoration: 'none',
      '&:hover': {
        opacity: 0.7,
      },
    },
  },
  pinkText: {
    color: colors.lightPink,
    padding: '2px 0',
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: button.pink,
}));

type NewsDetailContainerProps = {
  homeContent: HomeContent | null;
  latestNews: News[];
  news: News | null;
};

const NewsDetailContainer = ({
  homeContent,
  latestNews,
  news,
}: NewsDetailContainerProps) => {
  const classes = useStyles();
  const isSm = useMediaQuery('(max-width: 960px)');

  if (!homeContent || !news) {
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <Template
      hasSideBar={true}
      sideLinks={homeContent?.sideLinks ?? []}
      breadcrumb={{
        child: {
          title: 'お知らせ',
          href: '/news',
        },
        grandChild: {
          title: news?.title ?? '',
        },
      }}
      additionalSideComponents={[
        isSm ? undefined : (
          <TweetItemList
            title="口コミ"
            subTitle="Reviews"
            tweetIds={homeContent?.reviewTweetIds ?? []}
          />
        ),
        isSm ? undefined : (
          <TweetItemList
            title="今何してる？"
            subTitle="Girls' tweets"
            tweetIds={homeContent?.castsTweetIds?.slice(0, 10) ?? []}
          />
        ),
      ]}
    >
      {news && (
        <Paper className={classes.newsContainer}>
          <div className={classes.newsHeader}>
            <h1 className={classes.newsTitle}>{news.title}</h1>
            <span className={classes.newsTime}>
              更新日：
              <time dateTime={news.publishedAt}>
                {getDateString(news.publishedAt)}
              </time>
            </span>
          </div>
          {news.imageUrl !== '' && (
            <div className={classes.newsImageContainer}>
              <img src={news.imageUrl} className={classes.newsImage} />
            </div>
          )}
          <div className={classes.newsContent}>
            <TextContent
              dangerouslySetInnerHTML={{
                __html: news.content,
              }}
            />
          </div>
          {process.browser && (
            <TwitterShareButton
              title={news.title}
              url={location.href}
              className={classes.tweetButton}
            >
              <TwitterIcon htmlColor={'#fff'} style={{ marginRight: '4px' }} />{' '}
              ツイート
            </TwitterShareButton>
          )}
          <div className={classes.newsTagContainer}>
            <span className={classes.text}>この記事に含まれるタグ：</span>
            {news.tags.map((tag) => (
              <TagItem
                key={`${news.id}-${tag}`}
                title={tag}
                href={`/news/tags/${tag}`}
              />
            ))}
          </div>
          <div className={classes.newsListContainer}>
            <span className={classes.text} style={{ fontWeight: 700 }}>
              最新のお知らせ
            </span>
            <Divider />
            {latestNews.map((news) => (
              <div className={classes.newsItem} key={news.id}>
                <Link href={`/news/${news.id}`} passHref>
                  <a className={classes.text}>{news.title}</a>
                </Link>
                <span className={classes.pinkText}>
                  {getDateStringDots(news.publishedAt)}
                </span>
              </div>
            ))}
          </div>
        </Paper>
      )}
      <div className={classes.flex}>
        <Link href="/news">
          <Button className={classes.backButton} color="inherit" href="/news">
            一覧に戻る
          </Button>
        </Link>
      </div>
    </Template>
  );
};

export default NewsDetailContainer;
