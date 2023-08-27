import React from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import type { InferGetStaticPropsType } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import { useAuth } from '@/hooks/auth';
import { authOperations, authSelectors } from '@/store/auth';
import { ThunkDispatch } from '@/store';
import NotFound from '@/components/common/NotFound';
import Template from '@/containers/app/Template';
import MetaHead from '@/components/common/Head';
import UserForm from '@/containers/app/user/AuthUserForm';
import { buttonSquare } from '@/config/ui';

const useStyles = makeStyles((theme) => ({
  loader: {
    margin: '32px auto',
    textAlign: 'center',
  },
  container: {
    width: '550px',
    maxWidth: '550px',
    margin: '0 auto 64px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: theme.spacing(2, 'auto', 0),
    },
  },
  dangerButtonContainer: {
    margin: theme.spacing(4, 0),
    textAlign: 'right',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  dangerButton: {
    ...buttonSquare.gray,
    fontSize: '0.9rem',
    margin: '0 auto',
    padding: '4px 16px',
  },
}));

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  try {
    const [homeContentSnap] = await Promise.all([
      await contentDocument('home').withConverter(homeConverter).get(),
    ]);
    return {
      props: {
        homeContent: homeContentSnap?.data() ?? null,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        homeContent: null,
      },
      revalidate: 1,
    };
  }
};

const SettingsAccountEdit = ({ homeContent }: Props): JSX.Element => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { user, isInitialized, isFetching } = useAuth();
  const { isDeleting } = useSelector(authSelectors.state);
  const dispatch = useDispatch<ThunkDispatch>();

  const deleteAuthUser = React.useCallback(() => {
    if (user && confirm('本当にアカウントを削除しますか？')) {
      dispatch(
        authOperations.deleteAuthUser(
          user.uid,
          () => {
            enqueueSnackbar('アカウントを削除しました');
            router.push('/');
          },
          () => enqueueSnackbar('アカウントを削除できませんでした'),
        ),
      );
    }
  }, [dispatch, user, enqueueSnackbar, router]);

  const onSubmit = () => {
    enqueueSnackbar('アカウント情報を更新しました');
    router.push('/settings/account');
  };

  return isInitialized && !user ? (
    <NotFound />
  ) : (
    <>
      <MetaHead
        title={'アカウント設定 | ますかれーど'}
        keyword={''}
        image={'/ogp_image.png'}
        url={'/'}
      />
      <Template
        hasSideBar={false}
        sideLinks={homeContent?.sideLinks ?? []}
        breadcrumb={{
          child: {
            title: 'アカウント設定',
          },
        }}
      >
        {!user || !isInitialized || isFetching ? (
          <div className={classes.loader}>
            <CircularProgress color="secondary" />
          </div>
        ) : (
          <div className={classes.container}>
            <UserForm user={user} isRegistration={false} onSubmit={onSubmit} />
            <div className={classes.dangerButtonContainer}>
              <Button
                className={classes.dangerButton}
                variant="contained"
                onClick={deleteAuthUser}
                startIcon={isDeleting && <CircularProgress size={16} />}
              >
                アカウントを削除
              </Button>
            </div>
          </div>
        )}
      </Template>
    </>
  );
};

export default SettingsAccountEdit;
