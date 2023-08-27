import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Tweet } from 'react-twitter-widgets';
import SectionTitle from './SectionTitle';

const useStyles = makeStyles((theme) => ({
  tweetContainer: {
    overflowY: 'auto',
    [theme.breakpoints.down('sm')]: {
      height: '460px',
      margin: theme.spacing(1, 1, 0),
      padding: theme.spacing(1, 1),
    },
    [theme.breakpoints.up('md')]: {
      height: '600px',
      margin: theme.spacing(0, 0, -1),
      padding: theme.spacing(1, 0),
    },
    '& iframe': {
      width: '100% !important',
    },
  },
}));

type Props = {
  title: string;
  subTitle: string;
  tweetIds: string[];
};

interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  twttr: any;
}
declare let window: Window;

const TweetItemList = React.memo<Props>(({ title, subTitle, tweetIds }) => {
  const classes = useStyles();

  const containerElem = React.useRef(null);

  React.useEffect(() => {
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load(containerElem);
    }
  }, []);
  return (
    <>
      <SectionTitle title={title} subTitle={subTitle} />
      <div className={clsx(classes.tweetContainer, containerElem)}>
        {tweetIds.map((tweetId) => (
          <Tweet
            key={tweetId}
            tweetId={tweetId}
            options={{
              lang: 'ja',
              chrome: 'noheader, nofooter',
              border: 'none',
            }}
          />
        ))}
      </div>
    </>
  );
});

export default TweetItemList;
