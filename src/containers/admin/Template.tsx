import { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import Head from '@/components/common/Head';
import NotFound from '@/components/common/NotFound';
import { sidebarWidth } from '@/config/ui';
import { useAuth } from '@/hooks/auth';
import { isAdmin } from '@/libs/models/adminUser';
import Header from './Header';
import Sidebar, { SmallSidebar } from './Sidebar';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  loader: {
    margin: '32px auto',
    textAlign: 'center',
  },
  container: {
    flexGrow: 1,
    width: `calc(100vw - ${sidebarWidth}px)`,
  },
}));

type Props = {
  isLoading?: boolean;
  goBackOption?: {
    href: string;
    as: string;
    label: string;
  };
};

const AdminTemplate: React.FC<Props> = ({
  children,
  isLoading,
  goBackOption,
}) => {
  const classes = useStyles();
  const [isNotFound, setIsNotFound] = useState(false);
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && (user === null || !isAdmin(user.role))) {
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
      {!isNotFound && isInitialized && user && (
        <div className={classes.root}>
          <Header isLoading={isLoading} />
          {goBackOption ? (
            <SmallSidebar goBackOption={goBackOption} />
          ) : (
            <Sidebar user={user} />
          )}
          <div className={classes.container}>
            <Toolbar />
            <div>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminTemplate;
