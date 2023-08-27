import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';
import CachedIcon from '@material-ui/icons/Cached';
import { buttonSquare, colors } from '@/config/ui';
import RoleIcon from '@/components/common/RoleIcon';
import { AuthUser } from '@/store/auth';
import { sexLabel, userRoleToDisplayName } from '@/libs/models/user';
import { getDateStringJa } from '@/libs/utils/dateFormat';
import { zoneNameToDisplayName } from '@/libs/utils/zone';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '550px',
    maxWidth: '550px',
    margin: '0 auto 32px',
    padding: theme.spacing(2, 0),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: theme.spacing(2, 'auto', 0),
    },
  },
  title: {
    fontWeight: 700,
    fontSize: '1.3rem',
    color: colors.brown,
    margin: theme.spacing(1, 0, 2),
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 0, 2),
      fontSize: '1.2rem',
    },
  },
  mainContainer: {
    width: '100%',
  },
  item: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px dashed ${colors.gray}`,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: theme.spacing(2, 2),
    },
  },
  flexBetween: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  avatarContainer: {
    '& img': {
      borderRadius: '50%',
    },
  },
  label: {
    fontSize: '1rem',
    marginBottom: theme.spacing(0.5),
    color: colors.brown,
    fontWeight: 700,
    minWidth: '150px',
    '& b': {
      color: colors.lightPink,
      fontSize: '1rem',
      margin: theme.spacing(0, 1),
    },
  },
  contentText: {
    color: colors.brown,
    display: 'flex',
    alignItems: 'center',
  },
  disabledText: {
    color: colors.brownText,
    opacity: 0.8,
    display: 'flex',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3, 3, 2),
    '& div': {
      width: '100%',
    },
  },
  mainButton: {
    ...buttonSquare.pink,
    width: '100%',
    maxWidth: '300px',
    margin: '0 auto',
  },
  inlineButton: {
    ...buttonSquare.pink,
    fontSize: '0.9rem',
    margin: '0 auto',
    padding: '2px 8px',
  },
}));

type Props = {
  user: AuthUser;
};

const UserInfo: React.FC<Props> = ({ user }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.container}>
      <h2 className={classes.title}>アカウント設定</h2>
      <Divider />
      <div className={classes.mainContainer}>
        <div className={clsx(classes.item, classes.avatarContainer)}>
          <InputLabel shrink className={classes.label}>
            プロフィールアイコン
          </InputLabel>
          <Avatar alt="avatar" src={user.avatarUrl ?? ''} />
        </div>
        <div className={classes.item}>
          <InputLabel shrink className={classes.label}>
            ユーザーネーム
          </InputLabel>
          <span className={classes.contentText}>{user.displayName}</span>
        </div>
        <div className={classes.item}>
          <InputLabel shrink className={classes.label}>
            メールアドレス
          </InputLabel>
          <span className={classes.contentText}>{user.email}</span>
        </div>
        <div className={classes.item}>
          <InputLabel shrink className={classes.label}>
            会員ステータス
          </InputLabel>
          <div className={classes.flexBetween}>
            <span className={classes.disabledText}>
              {userRoleToDisplayName[user.role]}
              <span style={{ margin: '0 4px', height: '14px' }}>
                <RoleIcon role={user.role} />
              </span>
            </span>
            {typeof window !== 'undefined' && (
              <Button
                className={classes.inlineButton}
                variant="contained"
                color="primary"
                startIcon={<CachedIcon />}
                href={`https://asia-northeast1-${process.env.NEXT_PUBLIC_PROJECT_ID}.cloudfunctions.net/discordApi/login?redirect_url=${window.location.origin}${window.location.pathname}&referrer=${window.location.origin}${window.location.pathname}`}
              >
                会員ステータスを更新
              </Button>
            )}
          </div>
        </div>
        <div className={classes.item}>
          <InputLabel shrink className={classes.label}>
            Discord ID
          </InputLabel>
          <span className={classes.disabledText}>{user.discordId}</span>
        </div>
        <div className={classes.item}>
          <InputLabel shrink className={classes.label}>
            生年月日
          </InputLabel>
          <span className={classes.contentText}>
            {user.dateOfBirth ? getDateStringJa(user.dateOfBirth) : '未設定'}
          </span>
        </div>
        <div className={classes.item}>
          <InputLabel shrink className={classes.label}>
            性別
          </InputLabel>
          <span className={classes.contentText}>
            {user.sex ? sexLabel[user.sex] : '未設定'}
          </span>
        </div>
        <div className={classes.item}>
          <InputLabel shrink className={classes.label}>
            都道府県
          </InputLabel>
          <span className={classes.contentText}>
            {user.prefecture
              ? zoneNameToDisplayName(user.prefecture)
              : '未設定'}
          </span>
        </div>
        <div className={classes.buttonContainer}>
          <Link href="/settings/account/edit" passHref>
            <Button
              className={classes.mainButton}
              variant="contained"
              color="primary"
            >
              アカウント情報を修正
            </Button>
          </Link>
        </div>
      </div>
    </Paper>
  );
};

export default UserInfo;
