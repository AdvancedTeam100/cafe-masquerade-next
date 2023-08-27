import { useCallback, useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import {
  livestreamingConverter,
  livestreamingDocument,
} from '@/libs/firebase/firestore/livestreaming';
import { Livestreaming } from '@/libs/models/livestreaming';
import LivestreamingChat from '@/containers/app/livestreaming/LivestreamingChat';

const useStyles = makeStyles(() => ({
  container: {
    height: '100vh',
  },
  loader: {
    margin: '32px auto',
    textAlign: 'center',
  },
}));

const LivestreamingLiveChat = () => {
  const classes = useStyles();
  const router = useRouter();
  const livestreamingId = router.query?.id ? String(router.query?.id) : '';

  const [livestreaming, setLivestreaming] = useState<Livestreaming>();

  const get = useCallback(async () => {
    if (livestreamingId) {
      const docSnap = await livestreamingDocument(livestreamingId)
        .withConverter(livestreamingConverter)
        .get();
      const livestreaming = docSnap.data();
      if (livestreaming) {
        setLivestreaming(livestreaming);
      }
    }
  }, [livestreamingId]);

  useEffect(() => {
    get();
  }, [get]);

  return (
    <div className={classes.container}>
      {!livestreaming ? (
        <div className={classes.loader}>
          <CircularProgress color="secondary" />
        </div>
      ) : (
        <LivestreamingChat livestreaming={livestreaming} isPopup={true} />
      )}
    </div>
  );
};

export default LivestreamingLiveChat;
