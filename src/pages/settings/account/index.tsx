import React from 'react';
import type { InferGetStaticPropsType } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import { useAuth } from '@/hooks/auth';
import NotFound from '@/components/common/NotFound';
import Template from '@/containers/app/Template';
import MetaHead from '@/components/common/Head';
import UserInfo from '@/containers/app/user/UserInfo';

const useStyles = makeStyles(() => ({
  loader: {
    margin: '32px auto',
    textAlign: 'center',
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

const SettingsAccount = ({ homeContent }: Props): JSX.Element => {
  const classes = useStyles();
  const { user, isInitialized, isFetching } = useAuth();

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
          <UserInfo user={user} />
        )}
      </Template>
    </>
  );
};

export default SettingsAccount;
