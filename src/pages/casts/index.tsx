import React from 'react';
import type { InferGetStaticPropsType } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import {
  contentDocument,
  homeConverter,
} from '@/libs/firebase/firestore/content';
import { castCollection, castConverter } from '@/libs/firebase/firestore/cast';
import {
  castTagCollection,
  castTagConverter,
} from '@/libs/firebase/firestore/castTag';
import { CastStatus } from '@/libs/models/cast';
import { colors } from '@/config/ui';
import Template from '@/containers/app/Template';
import CastTagForm from '@/containers/app/cast/CastTagForm';
import MetaHead from '@/components/common/Head';
import SectionTitle from '@/components/app/common/SectionTitle';
import CastList from '@/components/app/cast/CastList';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2),
    },
  },
  tagForm: {
    padding: theme.spacing(2, 7),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      borderBottom: `3px solid ${colors.backgroundBeige}`,
    },
  },
  matchResult: {
    color: colors.brown,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    '& b': {
      color: 'red',
      fontSize: '24px',
      marginRight: '4px',
    },
  },
  castList: {
    padding: '0 56px',
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
}));

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  try {
    const [
      homeContentSnap,
      castQuerySnap,
      castTagQuerySnap,
    ] = await Promise.all([
      await contentDocument('home').withConverter(homeConverter).get(),
      await castCollection()
        .withConverter(castConverter)
        .where('status', '==', CastStatus.Published)
        .orderBy('joinedAt', 'desc')
        .get(),
      await castTagCollection().withConverter(castTagConverter).get(),
    ]);
    return {
      props: {
        homeContent: homeContentSnap?.data() ?? null,
        casts: castQuerySnap.docs.map((doc) => doc.data()),
        castTags: castTagQuerySnap.docs.map((doc) => doc.data()),
      },
      revalidate: 60,
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        homeContent: null,
        casts: [],
        castTags: [],
      },
      revalidate: 1,
    };
  }
};

const CastIndex = ({
  homeContent,
  casts: initialCasts,
  castTags,
}: Props): JSX.Element => {
  const isSm = useMediaQuery('(max-width: 960px)');
  const classes = useStyles();
  const [casts, setCasts] = React.useState(initialCasts);

  const onChangeCheckedTag = (tags: string[]) => {
    if (tags.length > 0) {
      const matchedCasts = initialCasts.filter((cast) => {
        const matchedTags = cast.tags.filter((tag) => tags.includes(tag));
        if (matchedTags.length === tags.length) {
          return cast;
        }
      });
      setCasts(matchedCasts);
    } else {
      setCasts(initialCasts);
    }
  };

  return (
    <>
      <MetaHead
        title={'在籍表 | ますかれーど'}
        keyword={''}
        image={'/ogp_image.png'}
        url={'/casts'}
      />
      <Template
        hasSideBar={false}
        sideLinks={homeContent?.sideLinks ?? []}
        breadcrumb={{
          child: {
            title: '在籍表',
          },
        }}
      >
        <Paper className={classes.container}>
          <SectionTitle title="在籍表" subTitle="Casts List" />
          <div className={classes.tagForm}>
            <CastTagForm tags={castTags} onChange={onChangeCheckedTag} />
            <p className={classes.matchResult}>
              <b>{casts.length}</b>人の女の子が見つかりました
            </p>
          </div>
          <div className={classes.castList}>
            <CastList
              casts={casts}
              breakpointsCols={isSm ? 1 : 4}
              isSmRow={isSm}
            />
          </div>
        </Paper>
      </Template>
    </>
  );
};

export default CastIndex;
