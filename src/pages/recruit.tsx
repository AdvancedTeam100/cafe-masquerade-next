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
    padding: theme.spacing(2, 4, 2),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(2, 2, 2),
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

const Recruit = ({ homeContent }: Props): JSX.Element => {
  const classes = useStyles();
  const isSm = useMediaQuery('(max-width: 960px)');
  return (
    <>
      <MetaHead
        title={'新規キャスト募集 | ますかれーど'}
        keyword={''}
        image={'/recruit.png'}
        url={'/about-masquerade'}
      />
      <Template
        hasSideBar={true}
        sideLinks={homeContent?.sideLinks ?? []}
        breadcrumb={{
          child: {
            title: '新規キャスト募集',
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
          <SectionTitle title="新規キャスト募集" subTitle="Recruit" />
          <div className={classes.content}>
            <Image
              src="/recruit.png"
              width={960}
              height={540}
              priority={true}
            />
            <TextContent>
              <p>
                バーチャルメイド喫茶『ますかれーど』では、一緒に働く新しいキャストを募集しております！
                <br />
                ご興味がある方がいらっしゃいましたら、ぜひご応募をお待ちしております。
              </p>
              <h2 style={{ color: 'rgb(235,107,86)' }}>
                ■『ますかれーど』のコンセプト
              </h2>
              <p>
                当店は、（自称）世界で初にして唯一のバーチャルメイド喫茶です。
                <br />
                リアル世界にて、様々なストレスを抱えている皆様に、当店のメイドたちは「いやし」と「いやらし」をお給仕いたします。
              </p>
              <h2 style={{ color: 'rgb(235,107,86)' }}>
                ■支配人からのメッセージ
              </h2>
              <p>
                『ますかれーど』とは仮面をつけ身分素性を隠して行われる舞踏会、
                仮装大会という意味がございます。当店では、リアル世界の立場や素性を忘れて、普段は人に言えない心の中にある秘め事や、
                自分をさらけ出して楽しんでほしいという願いを込めて、『ますかれーど』という名前を店名につけさせていただきました。
                現在も多数の先輩キャストが、日々ご主人様に「いやし」と「いやらし」を提供しております。
              </p>
              <p>
                当店での活動にご興味があり、私共の理念に共感していただけましたら、ぜひ一度当店への門戸を叩いていただければと存じます。
                <br />
                もちろん未経験の方も大歓迎でございます。
              </p>
              <p style={{ textAlign: 'right' }}>-支配人-</p>
              <h2 style={{ color: 'rgb(235,107,86)' }}>■充実のサポート体制</h2>
              <h3 style={{ color: 'rgb(84,172,210)' }}>
                ①SSS級の専用アバターをご提供
              </h3>
              <p>
                現在お給仕する当店キャストと同様に、業界最高水準の
                <br />
                SSS級クオリティーのアバターをご用意させて頂きます！
              </p>
              <h3 style={{ color: 'rgb(84,172,210)' }}>
                ②配信用機材の貸し出し
              </h3>
              <p>
                配信活動に向けて、当店から必要機材を貸し出しさせて頂きます！
                <br />
                アプリケーションの設定なども当店スタッフがしっかりサポート致します！
              </p>
              <p>
                ＜貸出配信例＞
                <br />
                ・iPhone X以上
                <br />
                ・配信用パソコン
                <br />
                {'　'}CPU：Ryzen 7 3700X / GPU：GeForce RTX 3070 8GB GDDR6
                <br />
                {'　'}SSD：1TB NVMe SSD / Memory：16GB DDR4 SDRAM
                <br />
                ・マイク{'　'}Shure WH20XLR / audio technica AT2050
                <br />
                ・バイノーラルマイク{'　'}3Dio Free Space XLR
                <br />
                ・オーディオインターフェース{'　'}Zoom LiveTrak L-8 / MOTU M4
              </p>
              <p>
                ※都内スタジオでは「NEUMANN ( ノイマン ) KU100
                」等のハイグレードなバイノーラルマイクを使用した配信も可能！
              </p>
              <h2 style={{ color: 'rgb(235,107,86)' }}>■募集要項</h2>
              <h3 style={{ color: 'rgb(84,172,210)' }}>〇募集要項</h3>
              <p>
                ・20歳以上の方。
                <br />
                ・週4回以上お給仕（配信）できる方（学生やお仕事をしながら、帰宅後、休日の配信でも大丈夫です）
                <br />
                ・1年間以上継続して長期間の配信活動が可能な方。
                <br />
                ・合格後、すぐに活動ができる方。
                <br />
                ・パソコンを使用した作業に慣れている方
                <br />
                ・当店のコンセプト、世界観にご賛同いただける方
              </p>
              <h3 style={{ color: 'rgb(84,172,210)' }}>〇選考フロー</h3>
              <p>
                ・1次選考：フォームエントリー
                <br />
                {'　'}応募フォームよりお送り頂いた情報を元に書類選考いたします。
                <br />
                {'　'}
                通過された方を対象に、メールにて面談に関するご連絡を差し上げます。
              </p>
              <p>
                ・2次選考：オンライン面談
                <br />
                {'　'}
                1次選考を通過された方を対象に、オンラインにて面談を実施します。
              </p>
              <h2 style={{ color: 'rgb(235,107,86)' }}>■応募フォーム</h2>
              <p>皆様のご応募お待ちしております！</p>
              <h1>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeQ7lKlUK2AE6rGo6YTyQvxBVkVm6fI6SKeZrsWs_LaXeFzIw/viewform"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  応募フォームはコチラ
                </a>
              </h1>
              <p>
                【情報の取り扱い】
                <br />
                ・本選考への応募を通じてご提供いただきました個人情報を、弊社が本選考に関すること以外の目的で使用することはありません。
                <br />
                ・応募者の方が本選考で知り得た情報について、第三者に漏洩することを禁じます。
              </p>
            </TextContent>
          </div>
        </Paper>
      </Template>
    </>
  );
};

export default Recruit;
