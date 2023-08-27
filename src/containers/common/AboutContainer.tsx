import AnchorLinkBar from '@/components/app/common/AnchorLinkBar';
import SectionTitle from '@/components/app/common/SectionTitle';
import TextContent from '@/components/app/common/TextContent';
import { AboutContent, HomeContent } from '@/libs/models/content';
import { CircularProgress, makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Template from '../app/Template';

const useStyles = makeStyles((theme) => ({
  linkContainer: {
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(2, 0),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(2, 0),
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
  },
  anchorLink: {
    marginBottom: '3px',
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
  },
  contentContainer: {
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(4),
    scrollMarginTop: '64px',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),
    },
  },
  content: {
    padding: theme.spacing(0, 4, 2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 2, 2),
    },
  },
  loader: {
    margin: '32px auto',
    textAlign: 'center',
  },
}));

type AboutContainerProps = {
  homeContent: HomeContent | null;
  aboutContent: AboutContent | null;
};

const AboutContainer = ({ aboutContent, homeContent }: AboutContainerProps) => {
  const classes = useStyles();

  if (!homeContent || !aboutContent) {
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Template
      hasSideBar={true}
      sideLinks={homeContent?.sideLinks ?? []}
      breadcrumb={{
        child: {
          title: 'ご利用方法',
        },
      }}
    >
      <div className={classes.linkContainer}>
        {aboutContent &&
          aboutContent.contents.map((content) => (
            <div className={classes.anchorLink} key={content.subTitle}>
              <AnchorLinkBar
                title={content.title}
                subTitle={content.subTitle}
                href={`#${content.subTitle.trim().replace(/ /g, '-')}`}
              />
            </div>
          ))}
      </div>
      {aboutContent &&
        aboutContent.contents.map((content) => (
          <Paper
            key={content.title}
            className={classes.contentContainer}
            id={content.subTitle.trim().replace(/ /g, '-')}
          >
            <SectionTitle title={content.title} subTitle={content.subTitle} />
            <div className={classes.content}>
              <TextContent
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            </div>
          </Paper>
        ))}
    </Template>
  );
};

export default AboutContainer;
