import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { ThunkDispatch } from '@/store';
import { authOperations, authSelectors } from '@/store/auth';

export const useAuth = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user, isFetching, isInitialized, errorCode, idToken } = useSelector(
    authSelectors.state,
  );
  const dispatch = useDispatch<ThunkDispatch>();
  const checkAuth = useCallback(() => {
    dispatch(
      authOperations.checkAuth(
        () => enqueueSnackbar('ログインしました'),
        () => enqueueSnackbar('ログインに失敗しました', { variant: 'error' }),
      ),
    );
  }, [dispatch, enqueueSnackbar]);
  const signOut = useCallback(() => {
    dispatch(
      authOperations.signOut(
        () => {
          enqueueSnackbar('ログアウトしました');
        },
        () => enqueueSnackbar('ログアウトに失敗しました', { variant: 'error' }),
      ),
    );
  }, [dispatch, enqueueSnackbar]);

  useEffect(() => {
    if (!isInitialized && user === null) {
      checkAuth();
    }
  }, [checkAuth, user, isInitialized]);
  return {
    user,
    isFetching,
    isInitialized,
    errorCode,
    signOut,
    isSignedIn: isInitialized && user !== null,
    idToken,
  };
};

export const useAuthWithToken = (
  token: string | string[] | undefined,
  showSnackbar: boolean,
) => {
  const { enqueueSnackbar } = useSnackbar();
  const { user, isFetching, isInitialized, errorCode, idToken } = useSelector(
    authSelectors.state,
  );
  const dispatch = useDispatch<ThunkDispatch>();
  const signInWithToken = useCallback(
    (token: string) => {
      dispatch(
        authOperations.signInWithToken(
          token,
          () => {
            if (showSnackbar) {
              enqueueSnackbar('ログインしました');
            }
          },
          () => {
            if (showSnackbar) {
              enqueueSnackbar('ログインに失敗しました', { variant: 'error' });
            }
          },
        ),
      );
    },
    [dispatch, enqueueSnackbar, showSnackbar],
  );

  useEffect(() => {
    if (!isFetching && user === null && token && typeof token === 'string') {
      signInWithToken(token);
    }
  }, [signInWithToken, user, token, isFetching]);
  return {
    user,
    isFetching,
    isInitialized,
    errorCode,
    idToken,
  };
};
