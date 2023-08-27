import React from 'react';
import { useRouter } from 'next/router';
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
import { getErrorMessage } from '../auth';

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
  },
  message: {
    margin: theme.spacing(2, 0, 3),
    color: colors.brownText,
    '& a': {
      color: colors.linkText,
      textDecoration: 'underline',
    },
  },
  button: {
    ...buttonSquare.discord,
    textTransform: 'none',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
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

const Signup = ({ homeContent }: Props): JSX.Element => {
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
        title={'新規アカウント作成 | ますかれーど'}
        keyword={''}
        image={'/ogp_image.png'}
        url={'/signup'}
      />
      <Template
        hasSideBar={false}
        sideLinks={homeContent?.sideLinks ?? []}
        breadcrumb={{
          child: {
            title: '新規アカウント作成',
          },
        }}
      >
        <Paper className={classes.container}>
          <h2 className={classes.title}>新規アカウント作成</h2>
          <Divider />
          <div className={classes.mainContainer}>
            {typeof window !== 'undefined' && (
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth={true}
                startIcon={
                  <img src="/svg/discord_icon.svg" width={25} height={20} />
                }
                href={`https://asia-northeast1-${process.env.NEXT_PUBLIC_PROJECT_ID}.cloudfunctions.net/discordApi/login?redirect_url=${redirect_url}&referrer=${window.location.origin}${window.location.pathname}`}
              >
                Discordで登録する
              </Button>
            )}
            {error && typeof error === 'string' && (
              <div className={classes.errorMessage}>
                {getErrorMessage(error)}
              </div>
            )}
            <p className={classes.message}>
              ※新規アカウント作成にはオンラインサロン会員限定『ますかれーど』Discordサーバーに参加している必要があります。オンラインサロンの詳細は
              <a
                href="https://ci-en.dlsite.com/creator/7561/plan"
                target="_blank"
                rel="noreferrer noopener"
              >
                こちら
              </a>
              をご確認ください。
            </p>
            <p className={classes.message}>
              ※アカウント作成ができないオンラインサロン会員の方は
              <a href="/contact" target="_blank">
                こちら
              </a>
              のフォームよりお問い合わせください。
            </p>
          </div>
        </Paper>
      </Template>
    </>
  );
};

export default Signup;
