import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { buttonSquare, colors } from '@/config/ui';
import Modal from '@/components/common/Modal';
import { UserRole, userRoleToDisplayName } from '@/libs/models/user';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '550px',
    padding: theme.spacing(3, 4),
    background: 'white',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 0.5),
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
    margin: theme.spacing(3),
    width: '220px',
  },
}));

type Props = {
  requiredRole: UserRole;
};

const LivestreamingRoleRequiredModal: React.FC<Props> = ({ requiredRole }) => {
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
          こちらのコンテンツは{userRoleToDisplayName[requiredRole]}以上
          <br />
          限定コンテンツです
        </h3>
        <p className={classes.message}>
          『ますかれーど』オンラインサロンのプラン詳細はこちら
          <br />
          <a href="https://ci-en.dlsite.com/creator/7561/plan">
            オンラインサロンプランについて
          </a>
        </p>
        <Link href={'/'} passHref>
          <Button
            className={classes.buttonPink}
            variant="contained"
            color="primary"
          >
            トップページに戻る
          </Button>
        </Link>
      </div>
    </Modal>
  );
};

export default LivestreamingRoleRequiredModal;
