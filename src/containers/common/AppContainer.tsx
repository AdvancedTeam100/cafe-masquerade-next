import { FC, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { PathHistory, routerActions } from '@/store/router';

const AppContainer: FC = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const addPathHistory = useCallback(
    (pathHistory: PathHistory) => {
      dispatch(routerActions.addHistory({ pathHistory }));
    },
    [dispatch],
  );

  useEffect(() => {
    const { asPath, pathname } = router;
    addPathHistory({ asPath, pathname });
  }, [router, addPathHistory]);

  return <>{children}</>;
};

export default AppContainer;
