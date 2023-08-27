import { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Head from '@/components/common/Head';
import NotFound from '@/components/common/NotFound';
import { colors, theme } from '@/config/ui';
import { useAuth } from '@/hooks/auth';
import { isAdmin } from '@/libs/models/adminUser';

const useStyles = makeStyles(() => ({
  loader: {
    margin: '32px auto',
    textAlign: 'center',
  },
  wrapper: {
    marginBottom: '36px',
  },
  previewLabel: {
    background: colors.lightPink,
    fontWeight: 700,
    padding: theme.spacing(1, 0),
    color: 'white',
    textAlign: 'center',
    position: 'fixed',
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 2000,
  },
}));

const PreviewWrapper: React.FC = ({ children }) => {
  const classes = useStyles();
  const [isNotFound, setIsNotFound] = useState(false);
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    if ((user === null || !isAdmin(user.role)) && isInitialized) {
      setIsNotFound(true);
    }
  }, [user, isInitialized]);

  return (
    <>
      <Head
        title="Masquerade Admin"
        description=""
        keyword=""
        image=""
        url=""
        isNoIndex={true}
      />
      {!isNotFound && !isInitialized && (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      )}
      {isNotFound && <NotFound />}
      {isInitialized && user && (
        <div className={classes.wrapper}>
          <div className={classes.previewLabel}>プレビューモード</div>
          {children}
        </div>
      )}
    </>
  );
};

export default PreviewWrapper;
