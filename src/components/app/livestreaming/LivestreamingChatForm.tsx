import React from 'react';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import LaunchIcon from '@material-ui/icons/Launch';
import { Theme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { SketchPicker } from 'react-color';
import { colors } from '@/config/ui';
import { LivestreamingMessage } from '@/libs/models/livestreamingMessage';
import Avatar from '@/components/common/Avatar';
import ListMenu from '@/components/app/common/ListMenu';
import { removeUndefinedProp } from '@/libs/utils/object';
import ColorPickIcom from '../../svg/chat_color_pick_icon.svg';
import ChatFixedIcon from '../../svg/chat_fixed_icon.svg';
import ChatNotFixedIcon from '../../svg/chat_not_fixed_icon.svg';

const useStyles = makeStyles<Theme, { isPopup: boolean }>((theme) => ({
  formContainer: {
    padding: theme.spacing(0, 2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100px',
    [theme.breakpoints.down('sm')]: {
      alignItems: (isPopup) => !isPopup && 'center',
      height: (isPopup) => !isPopup && '50px',
    },
  },
  formMainContainer: {
    display: 'flex',
    width: '100%',
    paddingLeft: theme.spacing(1),
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      flexDirection: (isPopup) => !isPopup && 'row',
    },
  },
  userName: {
    color: colors.brown,
    opacity: '0.7',
    margin: theme.spacing('2px', 0, 0),
    display: 'block',
    [theme.breakpoints.down('sm')]: {
      display: (isPopup) => !isPopup && 'none',
    },
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    color: colors.brown,
  },
  inputUnderline: {
    '&::before': {
      borderBottom: `1px solid ${colors.border}`,
      [theme.breakpoints.down('sm')]: {
        borderBottom: (isPopup) => !isPopup && 'none',
      },
    },
    '&:hover:not(.Mui-disabled):before': {
      borderBottom: `1px solid ${colors.border}`,
    },
    '&::after': {
      borderBottom: `2px solid ${colors.border}`,
      [theme.breakpoints.down('sm')]: {
        borderBottom: (isPopup) => !isPopup && 'none',
      },
    },
  },
  actionContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  valuesLength: {
    opacity: '0.6',
    marginRight: theme.spacing(1),
    display: 'inherit',
    [theme.breakpoints.down('sm')]: {
      display: (isPopup) => !isPopup && 'none',
    },
  },
}));

type Props = {
  userInfo: LivestreamingMessage['user'] | null;
  onSubmit: (
    input: string,
    option: { isFixed?: boolean; color?: string },
  ) => void;
  isPopup: boolean;
  livestreamingId: string;
};

const LivestreamingChatForm = React.memo<Props>(
  ({ userInfo, onSubmit, isPopup, livestreamingId }) => {
    const isSm = useMediaQuery('(max-width: 960px)');
    const classes = useStyles({ isPopup });

    const [input, setInput] = React.useState('');
    const [isFixed, setIsFixed] = React.useState(false);
    const [color, setColor] = React.useState<string>();
    const [isColorPickerOpened, setIsColorPickerOpened] = React.useState(false);

    const submit = () => {
      const option = removeUndefinedProp<{ isFixed?: boolean; color?: string }>(
        {
          isFixed,
          color,
        },
      );
      onSubmit(input, option);
      setInput('');
    };

    const onClickChatWindowOpen = React.useCallback(() => {
      window.open(
        `/livestreaming/live_chat?id=${livestreamingId}`,
        'livechat',
        'width=575,height=615menubar=no,location=no,status=no,',
      );
    }, [livestreamingId]);

    const isAdmin = userInfo?.isAdmin || userInfo?.castId !== undefined;

    return (
      <div className={classes.formContainer}>
        <Avatar
          src={userInfo?.avatarUrl ?? ''}
          size={24}
          fallbackSrc="/default_avatar.png"
        />
        <div className={classes.formMainContainer}>
          <p className={classes.userName}>{userInfo?.name ?? 'ご主人様'}</p>
          <div className={classes.inputContainer}>
            <Input
              placeholder={`${
                isSm && !isPopup ? `${userInfo?.name ?? 'ご主人様'}として` : ''
              }メッセージを入力`}
              value={input}
              fullWidth
              style={{
                color: color ?? colors.brown,
              }}
              classes={{
                underline: classes.inputUnderline,
              }}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              onKeyDown={(e) => {
                if ((e.charCode || e.keyCode) === 13 && input) {
                  submit();
                }
              }}
            />
            {!isSm && !isPopup && (
              <ListMenu
                items={[
                  {
                    text: 'チャットをポップアップ',
                    icon: (
                      <LaunchIcon htmlColor={colors.brown} fontSize="small" />
                    ),
                    onClick: onClickChatWindowOpen,
                  },
                ]}
                iconButtonSize="small"
              />
            )}
          </div>
          <div className={classes.actionContainer}>
            {isAdmin && (
              <div style={{ margin: '8px' }}>
                <IconButton
                  size="small"
                  onClick={() => setIsFixed(!isFixed)}
                  style={{ marginRight: '4px' }}
                >
                  {isFixed ? <ChatFixedIcon /> : <ChatNotFixedIcon />}
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setIsColorPickerOpened(!isColorPickerOpened)}
                >
                  <ColorPickIcom style={{ fil: color }} />
                </IconButton>
              </div>
            )}
            <span
              className={classes.valuesLength}
              style={{ color: input.length > 200 ? 'red' : 'inherit' }}
            >
              {input.length} / 200
            </span>
            <IconButton
              size="small"
              disableRipple={true}
              disableFocusRipple={true}
              onClick={() => submit()}
              disabled={input.length === 0 || input.length > 200}
            >
              <SendIcon
                style={{
                  color:
                    input.length === 0 || input.length > 200
                      ? colors.border
                      : colors.brown,
                  fontSize: 24,
                }}
              />
            </IconButton>
          </div>
          {isAdmin && isColorPickerOpened && (
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  position: 'fixed',
                  top: '0px',
                  right: '0px',
                  bottom: '0px',
                  left: '0px',
                }}
                onClick={() => setIsColorPickerOpened(false)}
              />
              <SketchPicker
                color={color}
                onChangeComplete={(color) => setColor(color.hex)}
              />
            </div>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.userInfo === nextProps.userInfo,
);

export default LivestreamingChatForm;
