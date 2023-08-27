import React from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import type { InferGetStaticPropsType } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import { useAuthWithToken } from '@/hooks/auth';
import NotFound from '@/components/common/NotFound';
import Template from '@/containers/app/Template';
import MetaHead from '@/components/common/Head';
import UserForm from '@/containers/app/user/AuthUserForm';

const useStyles = makeStyles((theme) => ({
  loader: {
    margin: '32px auto',
    textAlign: 'center',
  },
  container: {
    width: '550px',
    maxWidth: '550px',
    margin: '0 auto 32px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: theme.spacing(2, 'auto', 0),
    },
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

const SignupRegistration = ({ homeContent }: Props): JSX.Element => {
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { token, redirect_url } = router.query;
  const { user, isInitialized, isFetching, errorCode } = useAuthWithToken(
    token,
    false,
  );

  if (isInitialized && !isFetching && !user && errorCode) {
    router.push(`/signup?error=${errorCode}`);
  }

  const onSubmit = () => {
    enqueueSnackbar('アカウント登録が完了しました');
    if (redirect_url && typeof redirect_url === 'string') {
      router.push(`${redirect_url}?onboarding`);
    } else {
      router.push('/?onboarding');
    }
  };

  return isInitialized && !user ? (
    <NotFound />
  ) : (
    <>
      <MetaHead
        title={'会員情報入力 | ますかれーど'}
        keyword={''}
        image={'/ogp_image.png'}
        url={'/signup/registration'}
      />
      <Template
        hasSideBar={false}
        sideLinks={homeContent?.sideLinks ?? []}
        breadcrumb={{
          child: {
            title: '新規アカウント作成',
          },
          grandChild: {
            title: '会員情報入力',
          },
        }}
        skipCheckAuth={true}
      >
        {!user || !isInitialized || isFetching ? (
          <div className={classes.loader}>
            <CircularProgress color="secondary" />
          </div>
        ) : (
          <div className={classes.container}>
            <UserForm user={user} isRegistration={true} onSubmit={onSubmit} />
          </div>
        )}
      </Template>
    </>
  );
};

export default SignupRegistration;
