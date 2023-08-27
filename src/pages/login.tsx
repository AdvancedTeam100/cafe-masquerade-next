import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import type { InferGetStaticPropsType } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import { useAuth } from '@/hooks/auth';
import { buttonSquare, colors } from '@/config/ui';
import Template from '@/containers/app/Template';
import MetaHead from '@/components/common/Head';
import { getErrorMessage } from './auth';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '400px',
    maxWidth: '400px',
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
    margin: theme.spacing(4, 5),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(3, 2),
    },
  },
  errorMessage: {
    color: theme.palette.error.main,
    fontWeight: 500,
    margin: theme.spacing(2, 0),
    textAlign: 'center',
  },
  topMessage: {
    margin: theme.spacing(1, 0, 3),
    color: colors.brown,
    fontWeight: 700,
  },
  message: {
    margin: theme.spacing(2, 0, 1),
    color: colors.brownText,
    textAlign: 'center',
  },
  buttonDiscord: {
    ...buttonSquare.discord,
    textTransform: 'none',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
    },
  },
  buttonPink: buttonSquare.pink,
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

const Login = ({ homeContent }: Props): JSX.Element => {
  const classes = useStyles();
  const router = useRouter();
  const { user, isInitialized } = useAuth();
  const { redirect_url, error } = router.query;

  React.useEffect(() => {
    if (isInitialized && user) {
      if (redirect_url && typeof redirect_url === 'string') {
        router.push(redirect_url);
      } else {
        router.push('/');
      }
    }
  }, [redirect_url, user, isInitialized, router]);

  return (
    <>
      <MetaHead
        title={'ログイン | ますかれーど'}
        keyword={''}
        image={'/ogp_image.png'}
        url={'/login'}
      />
      <Template
        hasSideBar={false}
        sideLinks={homeContent?.sideLinks ?? []}
        breadcrumb={{
          child: {
            title: 'ログイン',
          },
        }}
      >
        <Paper className={classes.container}>
          <h2 className={classes.title}>ログイン</h2>
          <Divider />
          <div className={classes.mainContainer}>
            <p className={classes.topMessage}>
              『ますかれーど』オンラインサロン会員限定コンテンツの視聴にはこちらのログインが必要です。
            </p>
            {typeof window !== 'undefined' && (
              <Button
                className={classes.buttonDiscord}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth={true}
                startIcon={
                  <img src="/svg/discord_icon.svg" width={25} height={20} />
                }
                href={`https://asia-northeast1-${process.env.NEXT_PUBLIC_PROJECT_ID}.cloudfunctions.net/discordApi/login?redirect_url=${redirect_url}&referrer=${window.location.origin}${window.location.pathname}`}
              >
                Discordでログイン
              </Button>
            )}
            {error && typeof error === 'string' && (
              <div className={classes.errorMessage}>
                {getErrorMessage(error)}
              </div>
            )}
            <p className={classes.message}>
              アカウントをお持ちでない方はこちら
            </p>
            <Link href={`/signup?redirect_url=${redirect_url}`}>
              <Button
                className={classes.buttonPink}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth={true}
              >
                新規アカウント作成
              </Button>
            </Link>
          </div>
        </Paper>
      </Template>
    </>
  );
};

export default Login;
