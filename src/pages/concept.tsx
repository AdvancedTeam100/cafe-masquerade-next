import React from 'react';
import Image from 'next/image';
import type { InferGetStaticPropsType } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import Template from '@/containers/app/Template';
import MetaHead from '@/components/common/Head';
import TweetItemList from '@/components/app/common/TweetItemList';
import SectionTitle from '@/components/app/common/SectionTitle';
import TextContent from '@/components/app/common/TextContent';

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    padding: theme.spacing(2, 0, 1),
    marginBottom: theme.spacing(4),
    scrollMarginTop: '64px',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(2, 0),
    },
  },
  content: {
    padding: theme.spacing(2, 5, 2),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(2, 2, 2),
    },
  },
  link: {
    width: '300px',
    textDecoration: 'none',
    margin: theme.spacing(0, 1),
    '&:hover': {
      opacity: 0.7,
    },
  },
}));

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  try {
    const homeContentSnap = await contentDocument('home')
      .withConverter(homeConverter)
      .get();
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

const Concept = ({ homeContent }: Props): JSX.Element => {
  const classes = useStyles();
  const isSm = useMediaQuery('(max-width: 960px)');
  return (
    <>
      <MetaHead
        title={'ご利用方法 | ますかれーど'}
        keyword={''}
        image={'/ogp_image.png'}
        url={'/about-masquerade'}
      />
      <Template
        hasSideBar={true}
        sideLinks={homeContent?.sideLinks ?? []}
        breadcrumb={{
          child: {
            title: 'コンセプト',
          },
        }}
        additionalSideComponents={[
          isSm ? undefined : (
            <TweetItemList
              title="口コミ"
              subTitle="Reviews"
              tweetIds={homeContent?.reviewTweetIds ?? []}
            />
          ),
          <TweetItemList
            title="今何してる？"
            subTitle="Girls' tweets"
            tweetIds={homeContent?.castsTweetIds?.slice(0, 10) ?? []}
          />,
        ]}
      >
        <Paper className={classes.contentContainer}>
          <SectionTitle title="コンセプト" subTitle="Concept" />
          <div className={classes.content}>
            <TextContent>
              <Image
                src="/concept.png"
                width={1600}
                height={900}
                priority={true}
              />
              <p>
                当店は、（自称）世界で初にして唯一のバーチャルメイド喫茶です。
                リアル世界にて、様々なストレスを抱えている皆様に、当店のメイドたちは
                「いやし」と「いやらし」をお給仕いたします。
              </p>
              <h2>『ますかれーど』とは？</h2>
              <p>
                『ますかれーど』とは仮面をつけ身分素性を隠して行われる舞踏会、仮装大会という意味がございます。当店では、リアル世界の立場や素性を忘れて、普段は人に言えない心の中にある秘め事や、自分をさらけ出して楽しんでほしいという願いを込めて、『ますかれーど』という名前を店名につけさせていただきました。
              </p>
              <p>
                ぜひ、皆様もこのバーチャルメイド喫茶では、”仮面”
                を纏い、普段の自分を忘れ、なりたい自分や、本当の自分をさらけ出したご主人様ロールをお楽しみ頂き、
                <br />
                現世を忘れた素敵なひと時をお過ごしください。
              </p>
              <p style={{ textAlign: 'right' }}>-支配人-</p>
              <h2>会員限定オンラインサロンについて</h2>
              <p>
                『ますかれーど』をご支援頂ける特別なご主人様に向けた、会員限定のオンラインサロンをご用意させて頂きました。サロンでは、キャストやご主人様同士の交流の機会や、YouTubeでは配信出来ないようなお給仕の提供をさせて頂きます。
                <br />
                なお、ご支援頂いた金額に関しては、新たなサービスの開発費や、店舗維持費に使用させて頂きます。ご主人様からのご支援、お待ちしております。
              </p>
              <a
                className={classes.link}
                href="https://ci-en.dlsite.com/creator/7561"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Image
                  src="/banner_online_salon.png"
                  width={300}
                  height={100}
                  objectFit="contain"
                />
              </a>
            </TextContent>
          </div>
        </Paper>
      </Template>
    </>
  );
};

export default Concept;
