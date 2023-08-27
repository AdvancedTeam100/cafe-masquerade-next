/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { LivestreamingMessage } from '@/libs/models/livestreamingMessage';
import { colors } from '@/config/ui';
import clsx from 'clsx';
import Avatar from '@/components/common/Avatar';
import FixedListMenu from '@/components/app/common/FixedListMenu';
import FixedIcon from '../../svg/chat_fixed_icon.svg';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'relative',
    height: '100%',
  },
  container: {
    backgroundImage: 'url("/chat_background.png")',
    height: '100%',
  },
  scrollableContainer: {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '10px',
      height: '6px',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0, 0, 0, .1)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: colors.border,
      boxShadow: '0 0 0 1px rgba(255, 255, 255, .3)',
    },
  },
  messageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: theme.spacing('4px', 2),
  },
  user: {
    display: 'flex',
    alignItems: 'center',
  },
  userName: {
    margin: theme.spacing('4px', 1),
    fontWeight: 500,
  },
  text: {
    fontWeight: 500,
  },
  downwardIcon: {
    background: colors.lightPink,
    color: 'white',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    margin: '4px auto',
    width: '48px',
    height: '48px',
    '&:hover': {
      background: colors.pink,
      color: 'white',
    },
  },
  fixedMessage: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    minHeight: '60px',
  },
  fixedAttention: {
    marginLeft: theme.spacing(1),
    color: colors.brown,
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      transform: 'scale(0.8)',
      '& path': {
        fill: '#792727',
      },
    },
  },
}));

type Props = {
  messages: LivestreamingMessage[];
  hasEndReached: boolean;
  setHasEndReached: (reached: boolean) => void;
  hasUnreadMessages: boolean;
  fixedMessage: LivestreamingMessage | undefined;
  userInfo: LivestreamingMessage['user'] | null;
  deleteMessage?: (messageId: string) => void;
  removeFixedMessage?: (messageId: string) => void;
};

const LivestreamingChatList = ({
  messages,
  hasEndReached,
  setHasEndReached,
  hasUnreadMessages,
  fixedMessage,
  userInfo,
  deleteMessage,
  removeFixedMessage,
}: Props) => {
  const classes = useStyles();
  const containerRef = useRef<HTMLDivElement>(null);
  const fixedMessageRef = useRef<HTMLDivElement>(null);
  const [fullScrolledDiff, setFullScrolledDiff] = useState(0);

  const onScroll = () => {
    if (containerRef.current) {
      const currentTopHeightDiff =
        containerRef.current.scrollHeight - containerRef.current.scrollTop;

      setHasEndReached(currentTopHeightDiff - fullScrolledDiff <= 0);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    if (hasEndReached) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      setFullScrolledDiff(
        containerRef.current.scrollHeight - containerRef.current.scrollTop,
      );
    }
  }, [containerRef, hasEndReached, setHasEndReached]);

  const onEndReached = () => {
    setHasEndReached(true);
  };

  const isAdmin = userInfo?.isAdmin || userInfo?.castId !== undefined;

  return (
    <div className={classes.wrapper}>
      <div className={classes.container} id="message-list">
        <div
          className={classes.scrollableContainer}
          ref={containerRef}
          onScroll={onScroll}
          style={{
            height: `calc(100% - ${
              fixedMessage ? fixedMessageRef.current?.clientHeight ?? 60 : 0
            }px)`,
          }}
        >
          {messages.map((message, i) => {
            const isLongText =
              message.user.name.length + message.text.length > 22;
            const isMyMessage = userInfo?.userId === message.user?.userId;

            return (
              message.id !== fixedMessage?.id && (
                <div
                  key={`${i}-${message.id}`}
                  className={classes.messageWrapper}
                >
                  <div
                    className={classes.message}
                    style={{
                      flexDirection: isLongText ? 'column' : 'row',
                    }}
                  >
                    <div className={classes.user}>
                      <Avatar
                        src={message.user.avatarUrl}
                        size={24}
                        fallbackSrc="/default_avatar.png"
                      />
                      <span
                        className={classes.userName}
                        style={{
                          color: message.user.castId
                            ? 'rgba(255, 103, 103, 0.6)'
                            : message.user.isAdmin
                            ? '#96BBFF'
                            : 'rgba(149, 94, 75, 0.6)',
                        }}
                      >
                        {message.user.name}
                      </span>
                    </div>
                    <p
                      className={classes.text}
                      style={{
                        margin: isLongText ? '0 0 4px 32px' : '4px 0 0',
                        color: message.color ?? colors.brown,
                      }}
                    >
                      {message.text}
                    </p>
                  </div>
                  {(isAdmin || isMyMessage) && deleteMessage && (
                    <FixedListMenu
                      items={[
                        {
                          text: 'このコメントを非表示',
                          icon: (
                            <VisibilityOffIcon
                              htmlColor={colors.brown}
                              fontSize="small"
                            />
                          ),
                          onClick: () => deleteMessage(message.id),
                          shouldCloseClicking: true,
                        },
                      ]}
                      iconButtonSize="small"
                      buttonColor={colors.brown}
                    />
                  )}
                </div>
              )
            );
          })}
        </div>
        {fixedMessage && (
          <div
            className={clsx(classes.messageWrapper, classes.fixedMessage)}
            ref={fixedMessageRef}
          >
            <div
              className={classes.message}
              style={{ flexDirection: 'column' }}
            >
              <div className={classes.user}>
                <Avatar
                  src={fixedMessage.user.avatarUrl}
                  size={24}
                  fallbackSrc="/master_icon.png"
                />
                <span
                  className={classes.userName}
                  style={{
                    color: fixedMessage.user.castId
                      ? 'rgba(255, 103, 103, 0.6)'
                      : fixedMessage.user.isAdmin
                      ? '#96BBFF'
                      : 'rgba(149, 94, 75, 0.6)',
                    display: 'flex',
                  }}
                >
                  {fixedMessage.user.name}
                  <span className={classes.fixedAttention}>
                    <FixedIcon />
                    固定されたコメント
                  </span>
                </span>
              </div>
              <p
                className={classes.text}
                style={{
                  margin: '0 0 4px 32px',
                  color: fixedMessage.color ?? colors.brown,
                }}
              >
                {fixedMessage.text}
              </p>
            </div>
            {isAdmin && removeFixedMessage && (
              <FixedListMenu
                items={[
                  {
                    text: '固定を解除',
                    icon: <FixedIcon />,
                    onClick: () => removeFixedMessage(fixedMessage.id),
                    shouldCloseClicking: true,
                  },
                ]}
                iconButtonSize="small"
                buttonColor={colors.brown}
              />
            )}
          </div>
        )}
      </div>
      {hasUnreadMessages && (
        <IconButton onClick={onEndReached} className={classes.downwardIcon}>
          <ArrowDownwardIcon />
        </IconButton>
      )}
    </div>
  );
};

export default LivestreamingChatList;
