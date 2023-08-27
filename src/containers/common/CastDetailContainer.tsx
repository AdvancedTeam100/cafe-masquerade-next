import CastPageHeader from '@/components/app/cast/CastPageHeader';
import CastQa from '@/components/app/cast/CastQa';
import PastYoutubeVideoCarousel from '@/components/app/cast/PastYoutubeVideoCarousel';
import PastYoutubeVideos from '@/components/app/cast/PastYoutubeVideos';
import SocialLinkList from '@/components/app/cast/SocialLinkList';
import Carousel from '@/components/app/common/Carousel';
import SectionTitle from '@/components/app/common/SectionTitle';
import TagItem from '@/components/app/common/TagItem';
import TextContent from '@/components/app/common/TextContent';
import TweetTimeline from '@/components/app/common/TweetTimeline';
import LinkableParagraph from '@/components/common/LinkableParagraph';
import { colors } from '@/config/ui';
import { Cast } from '@/libs/models/cast';
import { HomeContent } from '@/libs/models/content';
import { makeStyles, useMediaQuery } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';

import React from 'react';
import { CastImage } from '@/libs/models/castImage';
import { YoutubeVideo } from '@/libs/models/youtubeVideo';
import { CastSchedule } from '@/libs/models/castSchedule';
import CastScheduleComponent from '@/components/app/cast/CastSchedule';
import Template from '../app/Template';

const useStyles = makeStyles((theme) => ({
  loader: {
    margin: '32px auto',
    textAlign: 'center',
  },
  sliderContainer: {
    background: colors.backgroundWine,
    paddingBottom: '100px',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0, -1, 1),
      borderRadius: '0px !important',
    },
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(3),
      paddingTop: theme.spacing(1),
    },
  },
  slider: {
    margin: '0 auto ',
    background: colors.backgroundWhite,
    [theme.breakpoints.down('sm')]: {},
    [theme.breakpoints.up('md')]: {
      width: '70%',
      borderRadius: '8px',
      '& div': {
        borderRadius: '8px',
      },
      '& .slick-track': {
        background: colors.backgroundDark,
      },
    },
  },
  castContainer: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(1),
    },
  },
  castTagContainer: {
    marginTop: '2px',
    borderTop: `3px solid ${colors.border}`,
    padding: theme.spacing(1, 0, 2),
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    '& a': {
      marginRight: theme.spacing(1),
    },
  },
  sectionContainer: {
    padding: theme.spacing(2, 0),
  },
  schedule: {
    padding: theme.spacing(2, 0),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0),
    },
  },
  castDesc: {
    padding: theme.spacing(2, 0),
    color: colors.brown,
    wordBreak: 'break-all',
    fontWeight: 500,
    '& p': {
      whiteSpace: 'pre-line',
      margin: theme.spacing(2, 0),
    },
  },
  youtubeVideos: {
    padding: theme.spacing(2, 0, 0, 0),
  },
}));

type CastDetailContainerProps = {
  cast: Cast | null;
  castImages: CastImage[];
  castSchedules: CastSchedule[];
  homeContent: HomeContent | null;
  youtubeVideos: YoutubeVideo[];
};

const CastDetailContainer = ({
  cast,
  castImages,
  castSchedules,
  homeContent,
  youtubeVideos,
}: CastDetailContainerProps) => {
  const classes = useStyles();
  const isSm = useMediaQuery('(max-width: 960px)');

  if (!cast || !homeContent) {
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Template
      hasSideBar={true}
      sideLinks={homeContent.sideLinks}
      breadcrumb={{
        child: {
          title: '在籍表',
          href: '/casts',
        },
        grandChild: {
          title: cast?.name ?? '',
        },
      }}
      topContent={
        <Paper className={classes.sliderContainer}>
          <div className={classes.slider}>
            <Carousel
              images={castImages.map((image) => ({
                url: image.imageUrl,
              }))}
              width={isSm ? 600 : 1600}
              height={isSm ? 800 : 1200}
              imagePaging={true}
              darkBackground={true}
              objectFit={isSm ? 'cover' : 'contain'}
              arrows={true}
            />
          </div>
        </Paper>
      }
      additionalSideComponents={[
        cast && !isSm && (
          <SocialLinkList
            twitter={cast.socialId.twitter}
            youtube={cast.youtubeChannelId}
            youtubeSecond={
              cast.youtubeChannelIdSecond && cast.youtubeChannelIdSecond
            }
            tiktok={cast.socialId.tiktok && cast.socialId.tiktok}
            twitcasting={cast.socialId.twitcasting && cast.socialId.twitcasting}
            niconico={cast.socialId.niconico && cast.socialId.niconico}
          />
        ),
        <TweetTimeline
          title="今何してる？"
          subTitle="Girl's tweets"
          twitterId={cast?.socialId.twitter ?? ''}
        />,
      ]}
    >
      <Paper className={classes.castContainer}>
        <CastPageHeader cast={cast} />
        <div className={classes.castTagContainer}>
          {cast.tags.map((tag) => (
            <TagItem title={tag} key={`tag-${tag}`} />
          ))}
        </div>
        <div className={classes.sectionContainer}>
          <SectionTitle title="出勤情報" subTitle="Schedule" />
          <div className={classes.schedule}>
            <CastScheduleComponent schedules={castSchedules} />
          </div>
        </div>
        {isSm && (
          <div className={classes.sectionContainer}>
            <SocialLinkList
              twitter={cast.socialId.twitter}
              youtube={cast.youtubeChannelId}
              youtubeSecond={
                cast.youtubeChannelIdSecond && cast.youtubeChannelIdSecond
              }
              tiktok={cast.socialId.tiktok && cast.socialId.tiktok}
              twitcasting={
                cast.socialId.twitcasting && cast.socialId.twitcasting
              }
              niconico={cast.socialId.niconico && cast.socialId.niconico}
            />
          </div>
        )}
        {cast.qa.length > 0 && (
          <div className={classes.sectionContainer}>
            <SectionTitle title="女の子に質問" subTitle="Questions" />
            <div className={classes.schedule}>
              <CastQa qa={cast.qa} />
            </div>
          </div>
        )}
        {cast.selfIntroduction !== '' && (
          <div className={classes.castDesc}>
            <SectionTitle title="キャストコメント" subTitle="Comments" />
            <LinkableParagraph sentence={cast.selfIntroduction} />
          </div>
        )}
        <div className={classes.castDesc}>
          <SectionTitle title="支配人からのコメント" subTitle="Comments" />
          <LinkableParagraph sentence={cast.description} />
        </div>
        <div className={classes.sectionContainer}>
          <SectionTitle title="過去のお給仕" subTitle="YouTube" />
          {youtubeVideos.length === 0 ? (
            <div className={classes.youtubeVideos}>
              <TextContent>表示できるお給仕がまだありません。</TextContent>
            </div>
          ) : isSm ? (
            <PastYoutubeVideos youtubeVideos={youtubeVideos} />
          ) : (
            <PastYoutubeVideoCarousel youtubeVideos={youtubeVideos} />
          )}
        </div>
      </Paper>
    </Template>
  );
};

export default CastDetailContainer;
