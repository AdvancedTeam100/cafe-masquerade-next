import React, { useState } from 'react';
import Link from 'next/link';
import type { InferGetStaticPropsType } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import { button, colors } from '@/config/ui';
import Template from '@/containers/app/Template';
import MetaHead from '@/components/common/Head';
import SectionTitle from '@/components/app/common/SectionTitle';
import ContactForm from '@/containers/app/contact/ContactForm';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(4),
    scrollMarginTop: '64px',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      width: '80%',
      margin: '0 auto 32px',
      padding: theme.spacing(2, 0),
    },
  },
  descriptionContainer: {
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(2, 1),
    },
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(4),
      padding: theme.spacing(0, 6),
    },
  },
  description: {
    margin: theme.spacing(1, 0, 2),
    color: colors.brown,
    fontWeight: 500,
    wordBreak: 'break-all',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1, 0),
    },
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: button.pink,
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
  const [hasSended, setHasSended] = useState(false);
  return (
    <>
      <MetaHead
        title={'お問い合わせ | ますかれーど'}
        keyword={''}
        image={'/ogp_image.png'}
        url={'/contact'}
      />
      <Template
        hasSideBar={false}
        sideLinks={homeContent?.sideLinks ?? []}
        breadcrumb={{
          child: {
            title: 'お問い合わせ',
          },
        }}
      >
        <Paper className={classes.container}>
          <SectionTitle title="お問い合わせ" subTitle="Contact" />
          {hasSended ? (
            <div className={classes.descriptionContainer}>
              <p className={classes.description}>
                お問い合わせありがとうございます。
              </p>
              <p className={classes.description}>
                内容を確認次第、担当者よりご連絡させていただきます。
              </p>
            </div>
          ) : (
            <div>
              <div className={classes.descriptionContainer}>
                <p className={classes.description}>
                  バーチャルメイド喫茶『ますかれーど』に関するご質問、所属キャストへのお仕事のご依頼などを受け付けております。
                  下記のフォームにご入力のうえ送信してください。
                </p>
                <p className={classes.description}>
                  当社は、お問い合わせフォームへご入力いただいた個人情報については、お問い合わせ内容への回答のみを目的として利用させていただきます｡
                </p>
                <p className={classes.description}>
                  皆様からいただいたご意見・ご感想・お問い合わせは必ず目を通しておりますが、個別に返信・対応をお約束するものではございません。何卒ご了承くださいますようお願い申し上げます。
                </p>
              </div>
              <ContactForm onSend={() => setHasSended(true)} />
            </div>
          )}
        </Paper>
        {hasSended && (
          <div className={classes.flex}>
            <Link href="/">
              <Button className={classes.backButton} color="inherit" href="/">
                トップに戻る
              </Button>
            </Link>
          </div>
        )}
      </Template>
    </>
  );
};

export default Concept;
