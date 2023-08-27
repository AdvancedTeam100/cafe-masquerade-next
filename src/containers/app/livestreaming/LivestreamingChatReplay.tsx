/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThunkDispatch } from '@/store';
import {
  livestreamingChatReplayActions,
  livestreamingChatReplayOperations,
  livestreamingChatReplaySelectors,
} from '@/store/app/livestreamingChatReplay';
import SectionTitle from '@/components/app/common/SectionTitle';
import LivestreamingChatList from '@/components/app/livestreaming/LivestreamingChatList';
import { useAuth } from '@/hooks/auth';
import { removeDuplicateItem } from '@/libs/utils/array';
import TextContent from '@/components/app/common/TextContent';
import { colors } from '@/config/ui';
import { isAdmin } from '@/libs/models/adminUser';

const useStyles = makeStyles<Theme, { wasLivestreaming: boolean }>((theme) => ({
  container: {
    height: ({ wasLivestreaming }) => (wasLivestreaming ? '100%' : '120px'),
    borderRadius: '12px',
    padding: theme.spacing(2, 0),
    [theme.breakpoints.down('sm')]: {
      borderRadius: '0 0 12px 12px',
      padding: theme.spacing(0),
    },
  },
  disabledChatReplay: {
    textAlign: 'center',
    color: colors.brownText,
  },
  chatListContainer: {
    padding: theme.spacing('16px', 0),
    height: 'calc(100% - 16px)',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 0, '8px'),
      height: 'calc(100%  - 8px)',
    },
  },
}));

type Props = {
  livestreamingId: string | null;
  startAt: number | null;
  wasLivestreaming: boolean;
};

const LivestreamingChatReplay: React.FC<Props> = ({
  livestreamingId,
  startAt,
  wasLivestreaming,
}) => {
  const { user } = useAuth();
  const isSm = useMediaQuery('(max-width: 960px)');
  const classes = useStyles({ wasLivestreaming });

  const dispatch = useDispatch<ThunkDispatch>();
  const { unreadIds } = useSelector(livestreamingChatReplaySelectors.state);
  const { messages, displayedId } = useSelector(
    livestreamingChatReplaySelectors.messages,
  );
  const incomingIds = useSelector(livestreamingChatReplaySelectors.incomingIds);

  const [hasEndReached, setHasEndReached] = useState(true);

  useEffect(() => {
    if (!livestreamingId || !startAt) return;
    dispatch(
      livestreamingChatReplayActions.setLivestreamingInfo({
        livestreamingId,
        startAt,
      }),
    );
    dispatch(livestreamingChatReplayOperations.getMessages());
  }, [livestreamingId, startAt]);

  useEffect(() => {
    if (hasEndReached) {
      const ids = removeDuplicateItem([...displayedId, ...unreadIds]);
      dispatch(livestreamingChatReplayActions.setListIds({ ids }));
      dispatch(livestreamingChatReplayActions.setUnreadIds({ ids: [] }));
    }
  }, [hasEndReached]);

  useEffect(() => {
    if (!incomingIds.length) return;
    if (hasEndReached) {
      const ids = removeDuplicateItem([...displayedId, ...incomingIds]);
      dispatch(livestreamingChatReplayActions.setListIds({ ids }));
      dispatch(livestreamingChatReplayActions.setUnreadIds({ ids: [] }));
    } else {
      const ids = removeDuplicateItem([...unreadIds, ...incomingIds]);
      dispatch(livestreamingChatReplayActions.setUnreadIds({ ids }));
    }
  }, [incomingIds]);

  const userInfo = user
    ? {
        name: user.displayName,
        avatarUrl: user.avatarUrl,
        userId: user.uid,
        isAdmin: isAdmin(user.role),
      }
    : null;

  return (
    <>
      <Paper className={classes.container} elevation={0}>
        {!isSm && (
          <SectionTitle title="おはなしのリプレイ" subTitle="Chat replay" />
        )}
        {wasLivestreaming ? (
          <div className={classes.chatListContainer}>
            <LivestreamingChatList
              messages={messages}
              hasEndReached={hasEndReached}
              setHasEndReached={(reached: boolean) => setHasEndReached(reached)}
              hasUnreadMessages={unreadIds.length > 0}
              fixedMessage={undefined}
              userInfo={userInfo}
            />
          </div>
        ) : (
          <TextContent>
            <p className={classes.disabledChatReplay}>
              こちらの動画はおはなしのリプレイが無効です
            </p>
          </TextContent>
        )}
      </Paper>
    </>
  );
};

export default LivestreamingChatReplay;
