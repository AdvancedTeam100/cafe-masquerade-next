/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { Theme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThunkDispatch } from '@/store';
import { Livestreaming } from '@/libs/models/livestreaming';
import {
  livestreamingChatActions as actions,
  livestreamingChatOperations as operations,
  livestreamingChatSelectors as selectors,
} from '@/store/app/livestreamingChat';
import { livestreamingMessageSubscription } from '@/libs/firebase/firestore/livestreamingMessage';
import SectionTitle from '@/components/app/common/SectionTitle';
import LivestreamingChatList from '@/components/app/livestreaming/LivestreamingChatList';
import LivestreamingChatForm from '@/components/app/livestreaming/LivestreamingChatForm';
import { useAuth } from '@/hooks/auth';
import { colors } from '@/config/ui';

const SM_FORM_HEIGHT = 50;
const FORM_HEIGHT = 100;

const useStyles = makeStyles<Theme, { isPopup: boolean; isSignedIn: boolean }>(
  (theme) => ({
    container: {
      height: '100%',
      borderRadius: '12px',
      padding: theme.spacing(2, 0),
      [theme.breakpoints.down('sm')]: {
        borderRadius: ({ isPopup }) => !isPopup && '0 0 12px 12px',
        padding: ({ isPopup }) => !isPopup && theme.spacing(0),
      },
    },
    chatListContainer: {
      padding: theme.spacing('16px', 0),
      [theme.breakpoints.up('md')]: {
        height: ({ isSignedIn }) =>
          isSignedIn ? `calc(100% - ${FORM_HEIGHT}px - 16px)` : '100%',
      },
      [theme.breakpoints.down('sm')]: {
        padding: ({ isPopup }) => !isPopup && theme.spacing(0, 0, '8px'),
        height: ({ isPopup, isSignedIn }) =>
          !isPopup && isSignedIn
            ? `calc(100% - ${SM_FORM_HEIGHT}px - 8px)`
            : '100%',
      },
    },
    preparingChat: {
      textAlign: 'center',
      color: colors.brownText,
    },
  }),
);

type Props = {
  livestreaming: Livestreaming;
  isPopup?: boolean;
};

const LivestreamingChat: React.FC<Props> = ({
  livestreaming,
  isPopup = false,
}) => {
  const { isSignedIn } = useAuth();
  const isSm = useMediaQuery('(max-width: 960px)');
  const classes = useStyles({ isPopup, isSignedIn });

  const dispatch = useDispatch<ThunkDispatch>();
  const { unreadIds, hasEndReached } = useSelector(selectors.state);
  const { messages, fixedMessage } = useSelector(selectors.messages);
  const userInfo = useSelector(selectors.userInfo);

  useEffect(() => {
    dispatch(actions.resetState());
    dispatch(
      actions.setLivestreamingId({
        livestreamingId: livestreaming.id,
      }),
    );
    const unsub = livestreamingMessageSubscription(
      livestreaming.id,
      (messages) => dispatch(actions.setNewMessages({ messages })),
      (messageId) => dispatch(actions.removeMessage({ id: messageId })),
    );
    return () => {
      unsub();
    };
  }, [livestreaming.id]);

  const setHasEndReached = (reached: boolean) => {
    if (reached === hasEndReached) return;
    if (reached) dispatch(actions.listAllUnreadMessages());
    dispatch(actions.setHasEndReached({ hasEndReached: reached }));
  };

  const deleteMessage = useCallback(
    (id: string) => {
      dispatch(operations.deleteMessage(id));
    },
    [dispatch],
  );

  const removeFixedMessage = useCallback(
    (id: string) => {
      dispatch(operations.updateMessage(id, { isFixed: false }));
    },
    [dispatch],
  );

  const createMessage = useCallback(
    (input: string, option: { isFixed?: boolean; color?: string }) => {
      if (userInfo && input) {
        const params = {
          text: input,
          user: userInfo,
          ...option,
          createdAt: new Date().toISOString(),
        };
        dispatch(operations.createMessage(params));
      }
    },
    [dispatch, userInfo],
  );

  return (
    <>
      <Paper className={classes.container} elevation={0}>
        {(!isSm || isPopup) && (
          <SectionTitle title="おはなし" subTitle="Chat" />
        )}
        <div className={classes.chatListContainer}>
          <LivestreamingChatList
            messages={messages}
            hasEndReached={hasEndReached}
            setHasEndReached={setHasEndReached}
            hasUnreadMessages={unreadIds.length > 0}
            fixedMessage={fixedMessage}
            userInfo={userInfo}
            deleteMessage={deleteMessage}
            removeFixedMessage={removeFixedMessage}
          />
        </div>
        {isSignedIn && (
          <LivestreamingChatForm
            userInfo={userInfo}
            onSubmit={createMessage}
            isPopup={isPopup}
            livestreamingId={livestreaming.id}
          />
        )}
      </Paper>
    </>
  );
};

export default LivestreamingChat;
