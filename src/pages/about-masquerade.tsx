import React from 'react';
import type { InferGetStaticPropsType } from 'next';
import {
  aboutConverter,
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import MetaHead from '@/components/common/Head';
import AboutContainer from '@/containers/common/AboutContainer';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  try {
    const [homeContentSnap, aboutContentSnap] = await Promise.all([
      await contentDocument('home').withConverter(homeConverter).get(),
      await contentDocument('about').withConverter(aboutConverter).get(),
    ]);
    return {
      props: {
        homeContent: homeContentSnap?.data() ?? null,
        aboutContent: aboutContentSnap?.data() ?? null,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        homeContent: null,
        aboutContent: null,
      },
      revalidate: 1,
    };
  }
};

const About = ({ homeContent, aboutContent }: Props): JSX.Element => {
  return (
    <>
      <MetaHead
        title={'ご利用方法 | ますかれーど'}
        keyword={''}
        image={'/ogp_image.png'}
        url={'/about-masquerade'}
      />
      <AboutContainer aboutContent={aboutContent} homeContent={homeContent} />
    </>
  );
};

export default About;
