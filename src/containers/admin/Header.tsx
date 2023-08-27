import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import HeaderAvatar from '@/components/common/HeaderAvatar';
import { boxShadow } from '@/config/ui';
import { useAuth } from '@/hooks/auth';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'white',
    boxShadow: boxShadow.default,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  content: {
    display: 'flex',
  },
  appBarTitle: {
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
  },
  menuMainItem: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  displayName: {
    fontSize: '14px',
    marginBottom: '2px',
  },
  email: {
    fontSize: '13px',
    color: '#666',
    marginTop: '2px',
  },
  menuText: {
    fontSize: '14px',
    padding: '4px 0',
  },
}));

type Props = {
  isLoading?: boolean;
};

const AdminHeader: React.FC<Props> = ({ isLoading }) => {
  const classes = useStyles();
  const { user, signOut } = useAuth();

  return (
    <AppBar
      className={classes.appBar}
      color="inherit"
      position="fixed"
      elevation={2}
    >
      <Toolbar className={classes.toolbar}>
        <div className={classes.content}>
          <Link href={'/admin'}>
            <a className={classes.appBarTitle}>
              <img src="/svg/logo_md.svg" alt="ますかれーど" />
            </a>
          </Link>
        </div>
        <div className={classes.content}>
          {user !== null && <HeaderAvatar authUser={user} signOut={signOut} />}
        </div>
      </Toolbar>
      {isLoading && <LinearProgress />}
    </AppBar>
  );
};

export default AdminHeader;
