import Link from 'next/link';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import { boxShadow, button, colors } from '@/config/ui';
import Modal from '@/components/common/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@/store';
import {
  livestreamingOperations,
  livestreamingSelectors,
} from '@/store/app/livestreaming';
import { useCookies } from 'react-cookie';
import { createMd5Hash } from '@/libs/utils/encryption';
import { authSelectors } from '@/store/auth';
import { checkUserRole } from '@/libs/models/livestreaming';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '550px',
    padding: theme.spacing(3, 4),
    background: 'white',
  },
  title: {
    margin: theme.spacing(2),
    fontSize: '1.2rem',
    fontWeight: 700,
    color: colors.brown,
  },
  input: {
    margin: theme.spacing(2),
    color: colors.brown,
  },
  inputUnderline: {
    '&::before': {
      borderBottom: `1px solid ${colors.border}`,
    },
    '&::after': {
      borderBottom: `2px solid ${colors.brown}`,
    },
  },
  attention: {
    margin: theme.spacing(1, 0),
    color: colors.brown,
    fontSize: '13px',
  },
  errorMessage: {
    color: theme.palette.error.main,
    margin: theme.spacing(2),
    fontWeight: 700,
  },
  button: {
    ...button.pink,
    padding: theme.spacing(2, 4),
    boxShadow: boxShadow.default,
  },
  link: {
    color: colors.lightPink,
    textAlign: 'center',
  },
  actionContainer: {
    margin: theme.spacing(3, 0, 0, 0),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  signinInduction: {
    margin: theme.spacing(1, 0),
    color: colors.brown,
    fontSize: '13px',
    textAlign: 'center',
  },
}));

type Props = {
  livestreamingId: string;
};

const LivestreamingPasswordModal: React.FC<Props> = ({ livestreamingId }) => {
  const classes = useStyles();
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch<ThunkDispatch>();
  const { isCheckingPass } = useSelector(livestreamingSelectors.state);
  const [_, setCookies] = useCookies();
  const { user } = useSelector(authSelectors.state);
  const { livestreaming } = useSelector(livestreamingSelectors.state);

  const onSubmit = () => {
    dispatch(
      livestreamingOperations.checkPassword(
        livestreamingId,
        createMd5Hash(input),
        () => {
          setCookies(livestreamingId, createMd5Hash(input), {
            maxAge: 3600 * 24 * 7,
            path: `/livestreaming/pass/${livestreamingId}`,
          });
        },
        () => {
          setErrorMessage('正しい合言葉を入力してください');
        },
      ),
    );
  };

  return (
    <Modal
      ariaLabel="ls-create-title"
      ariaDescription="ls-create-description"
      isOpened={true}
      onClose={() => console.log('password required')}
      hasBorderRadius={true}
      hasBlur={true}
    >
      <div className={classes.container}>
        <img src="/svg/logo_md_footer.svg" alt="ますかれーど" height="75px" />
        <h3 className={classes.title}>閲覧用の合言葉を入力してください</h3>
        <Input
          placeholder="合言葉を入力"
          value={input}
          fullWidth
          className={classes.input}
          disabled={isCheckingPass}
          classes={{
            underline: classes.inputUnderline,
          }}
          onChange={(e) => {
            setErrorMessage('');
            setInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if ((e.charCode || e.keyCode) === 13 && input) {
              onSubmit();
            }
          }}
        />
        {errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
        <Button
          className={classes.button}
          variant="contained"
          color="inherit"
          onClick={onSubmit}
          disabled={isCheckingPass}
          startIcon={isCheckingPass && <CircularProgress size={16} />}
        >
          送信
        </Button>
        <div className={classes.actionContainer}>
          {livestreaming &&
          (!user ||
            (user &&
              checkUserRole({
                requiredRole: livestreaming?.requiredRole,
                userRole: user.role,
              }))) ? (
            <>
              <p className={classes.signinInduction}>
                ログインして視聴をする場合はこちらから
              </p>
              <Link
                href={`/login?redirect_url=${window.location.origin}${window.location.pathname}`}
                passHref
              >
                <a className={classes.link}>ログインして視聴する</a>
              </Link>
            </>
          ) : (
            <Link href="/">
              <a className={classes.link}>トップに戻る</a>
            </Link>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default LivestreamingPasswordModal;
