import React from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { InferGetStaticPropsType } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import Template from '@/containers/app/Template';
import MetaHead from '@/components/common/Head';
import { useAuthWithToken } from '@/hooks/auth';

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

export const getErrorMessage = (error: string): string => {
  switch (error) {
    case 'discord/insufficient-role':
      return '現在あなたのロールでは会員登録することが出来ません。';
    case 'discord/member-not-found':
      return '『ますかれーど』Discordサーバーにユーザーデータが見つかりませんでした。';
    case 'auth/email-already-exists':
      return '指定されたメールアドレスは既に他のユーザーによって登録されています。';
    case 'auth/invalid-custom-token':
    case 'auth/unregistered-user':
      return '登録されていないユーザーまたは権限不足で登録できないユーザーです。';
    case 'auth/invalid-email':
      return 'メールアドレスが無効です。メールアドレスを再設定して再度試してください。';
    case 'auth/id-token-expired':
      return 'トークンの有効期限が切れています。再度試してください。';
    case 'auth/insufficient-permission':
      return '権限が足りません。';
    case 'auth/invalid-phone-number':
      return '電話番号が無効です。';
    case 'auth/phone-number-already-exists':
      return '電話番号は既に登録されています。';
    case 'auth/user-not-found':
      return 'ユーザー情報が見つかりませんでした。';
    default:
      return 'エラーが発生しました。再度試してください。';
  }
};

const Auth = ({ homeContent }: Props): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const router = useRouter();
  const { token, redirect_url } = router.query;
  const { user, isInitialized, errorCode } = useAuthWithToken(token, false);

  React.useEffect(() => {
    if (isInitialized && user) {
      if (redirect_url && typeof redirect_url === 'string') {
        router.push(redirect_url);
        if (redirect_url.includes('/settings/account')) {
          enqueueSnackbar('会員ステータスを更新しました');
        }
      } else {
        router.push('/');
      }
    } else if (errorCode) {
      router.push(`/signup?error=${errorCode}`);
    }
  }, [user, isInitialized, redirect_url, router, errorCode, enqueueSnackbar]);

  return (
    <>
      <MetaHead
        title={'バーチャルメイド喫茶『ますかれーど』公式WEBサイト'}
        keyword={''}
        image={'/ogp_image.png'}
        url={'/'}
      />
      <Template
        hasSideBar={false}
        sideLinks={homeContent?.sideLinks ?? []}
        breadcrumb={{
          child: {
            title: '',
          },
        }}
        skipCheckAuth={true}
      >
        <div className={classes.loader}>
          <CircularProgress color="secondary" />
        </div>
      </Template>
    </>
  );
};

export default Auth;
