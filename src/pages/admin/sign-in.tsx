import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import firebase from '@/libs/firebase';
import { getAuthErrorMessage } from '@/libs/firebase/errors';
import { theme } from '@/config/ui';
import { useAuth } from '@/hooks/auth';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '2em',
  },
  signInImg: {
    maxWidth: '250px',
    cursor: 'pointer',
    margin: '20px',
    '&:hover': {
      opacity: '0.8',
    },
  },
  error: {
    color: theme.palette.error.main,
  },
}));

const AdminSignIn = () => {
  const router = useRouter();
  const classes = useStyles();
  const { user, isFetching, isInitialized, errorCode } = useAuth();
  const errorMessage = useMemo(() => getAuthErrorMessage(errorCode), [
    errorCode,
  ]);

  if (user) {
    router.push('/admin');
  }
  return (
    <>
      <div className={classes.container}>
        <h2 className={classes.title}>ログイン</h2>
        {errorCode && <p className={classes.error}>{errorMessage}</p>}
        {isFetching ? (
          <CircularProgress />
        ) : user === null && isInitialized ? (
          <img
            className={classes.signInImg}
            src="/google_sign_in.png"
            alt="ログイン"
            onClick={() => {
              const provider = new firebase.auth.GoogleAuthProvider();
              firebase.auth().signInWithRedirect(provider);
            }}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default AdminSignIn;
