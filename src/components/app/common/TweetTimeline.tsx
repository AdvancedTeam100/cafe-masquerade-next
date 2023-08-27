import React from 'react';
import clsx from 'clsx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import { useTwitterScriptTag } from '@/hooks/scriptTag';
import SectionTitle from './SectionTitle';

const useStyles = makeStyles((theme) => ({
  tweetContainer: {
    padding: theme.spacing(2, 1, 0),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 4),
      marginBottom: theme.spacing(-3),
    },
  },
}));

type Props = {
  title: string;
  subTitle: string;
  twitterId: string;
};

interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  twttr: any;
}
declare let window: Window;

const TweetTimeline = React.memo<Props>(({ title, subTitle, twitterId }) => {
  const classes = useStyles();
  const isSm = useMediaQuery('(max-width: 960px)');
  useTwitterScriptTag();
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
        <a
          className="twitter-timeline"
          data-lang="ja"
          href={`https://twitter.com/${twitterId}?ref_src=twsrc%5Etfw`}
          data-chrome="noheader, nofooter"
          data-height={isSm ? '460' : '600'}
        />
      </div>
    </>
  );
});

export default TweetTimeline;
