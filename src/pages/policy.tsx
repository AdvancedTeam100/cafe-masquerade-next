import React from 'react';
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
    padding: theme.spacing(0, 4, 2),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(0, 2, 2),
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

const Policy = ({ homeContent }: Props): JSX.Element => {
  const classes = useStyles();
  const isSm = useMediaQuery('(max-width: 960px)');
  return (
    <>
      <MetaHead
        title={'プライバシーポリシー | ますかれーど'}
        keyword={''}
        image={'/ogp_image.png'}
        url={'/terms'}
      />
      <Template
        hasSideBar={true}
        sideLinks={homeContent?.sideLinks ?? []}
        breadcrumb={{
          child: {
            title: 'プライバシーポリシー',
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
          <SectionTitle
            title="プライバシーポリシー"
            subTitle="Privacy policy"
          />
          <div className={classes.content}>
            <TextContent>
              <h2>第１条（総則）</h2>
              <p>
                １.
                当社は、利用者情報の保護実現のため、個人情報保護法、各省庁ガイドラインその他関連する法令等を遵守いたします。
              </p>
              <p>
                ２.
                本ポリシーは、当社がインターネット上のサイト（https://cafe-masquerade.com/
                以下「本サイト」といいます。）で提供する各種サービスおよびこれに付随して当社が提供する各種サービスに適用されます。
              </p>
              <h2>第２条（取得する情報）</h2>
              <p>
                １．当社は、本サイトにおいて、以下に定めるとおり、個人情報（個人情報保護法第２条第１項により定義された「個人情報」をいい、以下同様とします。）を含む利用者情報を取得します。
              </p>
              <p>（１）利用者より直接ご提供いただく情報</p>
              <p>
                当社は、利用者が本サービスを利用する際、以下の情報を提供していただく場合があり、これらの提供された情報を取得します。
              </p>
              <p>ａ 基礎情報</p>
              <p>
                ユーザー名、メールアドレス、ユーザーアカウントにログインする際に本人確認に必要なパスワード等の情報
              </p>
              <p>ｂ その他登録情報</p>
              <p>
                氏名、住所、電話番号、生年月日、ユーザープロフィール（プロフィール画像、サービスのユーザー名またはニックネーム、性別、経歴その他利用者がプロフィールとして記載する情報、利用者ID）
              </p>
              <p>ｃ 決済に関する情報</p>
              <p>
                利用者のクレジットカード情報や銀行口座情報等の決済処理に必要な情報（第三者の決済サービス会社を利用する場合は利用者から当該決済サービス会社に提供された請求情報・支払情報等を含みます）
              </p>
              <p>ｄ その他利用者から提供される情報</p>
              <p>本サービスの利用に際して利用者が提供した一切の情報</p>
              <p>（２）本サービス利用時に当社が収集する情報</p>
              <p>ａ 端末情報</p>
              <p>
                当社は、利用者が使用する情報端末固有の情報（OSの種類、端末の個体識別情報、コンピュータ名、広告ID等）を取得し、広告IDを当社が利用者に付与した内部識別子に紐付ける場合があります。
              </p>
              <p>ｂ 位置情報</p>
              <p>
                当社は、本サイトの提供に必要な範囲内で、利用者の使用する情報端末から送信される位置情報を取得することがあります。
              </p>
              <p>ｃ ログ情報および行動履歴情報</p>
              <p>
                当社は、本サイトの利用時にIPアドレス、利用者が使用するブラウザの種類、ブラウザ言語等の情報が自動で生成・保存された情報又は利用者からのリクエスト日時、サービス内での操作履歴の一切の情報を取得することがあります。
              </p>
              <p>ｄ Cookie等を利用した情報</p>
              <p>
                本サイトにおいて、当社は、「Cookie（クッキー）」と呼ばれる技術およびこれに類する技術を使用することがあります。Cookieとは、ウェブサーバーが利用者のコンピュータを識別する業界標準の技術です。Cookieは、利用者のコンピュータを識別することはできますが、利用者個人を識別することはできません。なお、情報端末上の設定によりCookieの機能を無効にすることはできますが、本サイトの全部または一部が利用できなくなる場合があります。
              </p>
              <p>（３）サービスの利用に関連して収集される情報</p>
              <p>
                商品・サービスの購入およびその履歴、アンケート回答、サービスの評価その他の取引履歴や利用履歴に関する情報、本サイトに関するご連絡状況およびメールマガジンやDM等の本サイトのご案内状況に関する情報、電話やメールでの当社のサポートを受けた場合のやり取りに関する情報、個人情報の情報開示・訂正等の請求を行った場合の手続および提出を受けた資料に関する情報を取得することがあります。
              </p>
              <p>（４）コミュニケーション情報、コンテンツ情報</p>
              <p>
                本サイトにおいて利用者が他の利用者とコミュニケーションをとり、またはコンテンツをアップロードすることによりコミュニケーションやコンテンツの情報（テキスト、写真、画像、音声、ビデオ、アプリケーションその他の情報を含みます）を共有した場合、当社は、これらの情報を取得することがあります。
              </p>
              <p>（５）外部サービスとの連携により取得する情報</p>
              <p>
                本サイトにおいて、Facebook、Twitter、Ci-en、Discordその他の外部サービスとの連携または外部サービスを利用した認証を行う場合があり、これらの場合、当社は、外部サービスで利用者が利用するIDおよびその他外部サービスのプライバシー設定により利用者が連携先に開示を認めた情報を取得することがあります。
              </p>
              <p>
                ２．当社は、利用者情報の取得にあたっては、偽りその他不正の手段によらず、適正な方法により取得します。また、当社は、利用者が当社の提供するサービスを利用することによる取得以外の方法で利用者情報を取得する場合には、その利用目的を事前に通知または公表します。
              </p>
              <h2>第３条（利用目的）</h2>
              <p>
                １．当社は、本サイトの利用を通じて取得した個人情報を、下記の目的の範囲内で適正に取り扱います。利用者ご本人の同意なく利用目的の範囲を超えて利用することはありません。
              </p>
              <p>
                ａ
                当社（共同利用者を含みます。以下本条において同じ。）の商品・サービスの円滑な提供、維持、改善のため
              </p>
              <p>
                ｂ 料金や報酬等の計算、請求、支払、送金、その他の決済処理のため
              </p>
              <p>ｃ 本人確認、認証サービスのため</p>
              <p>ｄ キャンペーン、アンケート等の実施のため</p>
              <p>
                ｅ
                当社の提供するサービスに関するご連絡・ご案内、当社の規約・条件・ポリシーの変更や当社の提供するサービスの停止・中止等の重要な通知をお知らせするため
              </p>
              <p>
                ｆ
                当社の提供するサービス、当社の提供するコンテンツまたは広告の開発、提供、メンテナンスおよび向上に役立てるため
              </p>
              <p>ｇ 技術サポートの提供、利用者からの問い合わせ等の対応のため</p>
              <p>
                ｈ
                当社または第三者の商品またはサービスの広告の開発、提供、効果測定のため
              </p>
              <p>ｉ マーケティング調査、統計、分析のため</p>
              <p>
                ｊ
                違法行為、不正行為、当社の利用規約等に違反する行為またはこれらの可能性のある行為を防止し、調査し、または対策措置を講ずるため
              </p>
              <p>ｋ その他当社の各サービスにおいて定める目的のため</p>
              <p>
                ２．当社は、前項の利用目的を、変更前の利用目的と相当の関連性を有すると合理的に認められる範囲内において変更することがあり、変更した場合には、当社が別途定める方法により、利用者に通知または公表します。
              </p>
              <h2>第４条（第三者提供）</h2>
              <p>
                １．当社は、利用者情報のうち、個人情報については、以下の場合を除き、第三者に提供することはありません。
              </p>
              <p>
                （１）当社の各サービスにおける利用者同士の取引に際して、またはその取引に関するトラブルが生じた際に、利用者の氏名、ユーザー名、住所、電話番号、メールアドレス等の必要な情報を相手方利用者に開示する場合
              </p>
              <p>（２）別途、利用者の同意を得た場合</p>
              <p>（３）法令に基づく場合</p>
              <p>
                （４）当社の提供するサービスの利用上、利用者が他人の利益を害しもしくは公序良俗に反する行為その他当社の提供するサービスの利用規約等に違反する行為を行いまたはこれを行おうとするときに、当該行為に対して必要な措置を採る場合
              </p>
              <p>
                （５）人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき
              </p>
              <p>
                （６）公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき
              </p>
              <p>
                （７）国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき
              </p>
              <p>
                （８）合併、会社分割、事業譲渡その他の事由により利用者の個人情報を含む事業の承継がなされる場合
              </p>
              <p>
                ２．当社は、Facebook、Twitter、Ci-en、Discordその他の外部サービスとの連携または外部サービスを利用した認証にあたり、必要な範囲で、当該外部サービス運営会社に利用者情報を提供することがあります。
              </p>
              <h2>第５条（個人情報の取扱いの委託）</h2>
              <p>
                当社は、利用者から取得した個人情報を含む利用者情報の全部または一部の取扱いを第三者に委託（個人情報を含む情報の管理を事業者に委託する場合などをいいます。）することがあります。この場合、当社は、当該委託先との間で本ポリシーに準じる内容の秘密保持契約等をあらかじめ締結するとともに、当該委託先において情報の適切な安全管理が図られるよう、必要かつ適切な監督を行います。
              </p>
              <h2>第６条（情報収集モジュール）</h2>
              <p>
                本サイトには、各サービスの利用状況および本サービスまたは商品に関する広告効果等の情報を解析するため、Google,
                Inc.のGoogle
                Analyticsを利用してサイトの計測を行っております。これに付随して生成される「Cookie」を通じて分析を行うことがありますが、この際、IPアドレス等の利用者情報の一部が、Google,
                Inc.に収集される可能性があります。サイト利用状況の分析、サイト運営者へのレポートの作成、その他のサービスの提供目的に限りこれを使用します。利用者は、本サイトを利用することで、上記方法および目的においてGoogleが行うこうしたデータ処理につき許可を与えたものとみなします。
              </p>
              <p>
                ※「Cookie」は、利用者側のブラウザ操作により拒否することも可能です。ただしその際、本サイトの機能が一部利用できなくなる可能性があります。
              </p>
              <h2>第７条（安全管理体制）</h2>
              <p>
                １．当社は、利用者情報の漏洩、滅失または毀損の防止その他の利用者情報の保護のため、個人情報ファイルへのアクセス制限の実施、アクセスログの記録、また外部からの不正アクセス防止のためのセキュリティソフトの導入等、利用者情報の安全管理のために必要かつ適切な措置を講じています。
              </p>
              <p>
                ２．当社は、当社代表取締役を利用者情報管理責任者とし、利用者情報の適正な管理および継続的な改善を実施します。
              </p>
              <h2>第８条（情報開示・訂正等の請求）</h2>
              <p>
                １．利用者は、利用者が当社に提供した個人情報について、以下に定める手続に従い、開示を請求することができます。
              </p>
              <p>
                （１）当社ウェブサイト上の所定のフォームに必要事項を入力し送信する方法、または申請書に本人確認（代理人による申請の場合、適正な代理人であることの確認）のために必要な書類を同封のうえ、郵送する方法によりご請求ください。書面による申請の場合は、１回の申請ごとに手数料として１０００円を申し受けます。
              </p>
              <p>
                （２）前号に基づく請求につき本人確認がなされたときは、当社は、合理的な範囲で個人情報を開示します。ただし、個人情報保護法その他の法令により当社が開示義務を負わない場合または正当な理由なく同内容の請求が何度も繰り返される場合はこの限りではありません。
              </p>
              <p>
                ２．当社の保有する利用者に関する個人情報の内容が事実と異なる場合、利用者は、以下に定める手続に従い、訂正、追加、削除を請求することができます。
              </p>
              <p>
                （１）当社ウェブサイト上の所定のフォームに必要事項を入力し送信する方法、または申請書に本人確認（代理人による申請の場合、適正な代理人であることの確認）のために必要な書類を同封のうえ、郵送する方法によりご請求ください。
              </p>
              <p>
                （２）前号に基づく請求につき本人確認がなされたときは、当社は、合理的な範囲で遅滞なく調査を行い、その結果に基づき個人情報の訂正、追加、削除を行います。ただし、個人情報保護法その他の法令により当社がこれらの義務を負わない場合、正当な理由なく同内容の請求が何度も繰り返される場合、または過度な技術的作業を要する場合はこの限りではありません。
              </p>
              <h2>第９条（個人情報の消去）</h2>
              <p>
                当社は、当社が取得した利用者の個人情報につき、当社による通常の事業運営に照らして、当該個人情報を利用する必要がなくなった場合、遅滞なく消去します
              </p>
              <h2>第１０条（YouTubeAPIについて）</h2>
              <p>
                当社は、YouTube上の情報（チャンネル情報や画像、動画情報等）を取得するためにYouTubeAPIを使用することがあります。この場合のYouTubeAPIの利用は、
                <a href="https://developers.google.com/youtube/terms/api-services-terms-of-service">
                  YouTubeAPIサービス利用規約
                </a>
                と
                <a href="https://policies.google.com/privacy?hl=ja">
                  Google社のプライバシーポリシー
                </a>
                に従って行われます。
              </p>
              <h2>第１１条（本ポリシーの改定）</h2>
              <p>
                １．当社は、利用者情報の取扱いに関する法令・ガイドラインの改正や運用状況を適宜見直し、継続的な改善に務めるものとし、随時、本ポリシーを改定することがあります。
              </p>
              <p>
                ２．改定後の本ポリシーについては、本サイト上または当社のウェブサイトでの掲示その他分かりやすい方法により告知し、その時点から改定後の本ポリシーが適用されるものとします。
              </p>
              <p>
                ３．前項にかかわらず、法令上利用者の同意が必要となるような内容の変更を行うときは、別途当社が定める方法により、利用者の同意を取得します。
              </p>
              <h2>第１２条（お問い合わせ）</h2>
              <p>
                当社の利用者情報の取扱いに関するご意見、ご質問、苦情のお申出その他利用者情報の取扱いに関するお問い合わせは、下記窓口までご連絡ください。
              </p>
              <a href="/contact">https://cafe-masquerade.com/contact</a>
            </TextContent>
          </div>
        </Paper>
      </Template>
    </>
  );
};

export default Policy;