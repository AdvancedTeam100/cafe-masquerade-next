import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { buttonSquare, colors } from '@/config/ui';
import Modal from '@/components/common/Modal';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '550px',
    padding: theme.spacing(3, 4),
    background: 'white',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 1),
    },
  },
  title: {
    margin: theme.spacing(1, 0, 2),
    fontSize: '1.2rem',
    fontWeight: 700,
    color: colors.brown,
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.1rem',
    },
  },
  message: {
    margin: theme.spacing(0, 0, 1),
    color: colors.brownText,
    textAlign: 'center',
    '& a': {
      color: colors.linkText,
    },
  },
  buttonPink: {
    ...buttonSquare.pink,
    marginBottom: theme.spacing(3),
    width: '180px',
  },
}));

const LivestreamingAuthRequiredModal: React.FC = () => {
  const classes = useStyles();

  return (
    <Modal
      ariaLabel="ls-create-title"
      ariaDescription="ls-create-description"
      isOpened={true}
      onClose={() => {}}
      hasBorderRadius={true}
      hasBlur={true}
    >
      <div className={classes.container}>
        <img src="/svg/logo_md_footer.svg" alt="ますかれーど" width={120} />
        <h3 className={classes.title}>
          こちらは『ますかれーど』
          <br />
          オンラインサロン会員限定コンテンツです
        </h3>
        {typeof window !== 'undefined' && (
          <>
            <p className={classes.message}>
              既にアカウントをお持ちのご主人様はこちら
            </p>
            <Link
              href={`/login?redirect_url=${window.location.origin}${window.location.pathname}`}
              passHref
            >
              <Button
                className={classes.buttonPink}
                variant="contained"
                color="primary"
              >
                ログイン
              </Button>
            </Link>
            <p className={classes.message}>
              まだアカウントをお持ちでないご主人様はこちらから
              <br />
              <Link
                href={`/signup?redirect_url=${window.location.origin}${window.location.pathname}`}
                passHref
              >
                <a>新規アカウント作成</a>
              </Link>
            </p>
          </>
        )}
      </div>
    </Modal>
  );
};

export default LivestreamingAuthRequiredModal;
