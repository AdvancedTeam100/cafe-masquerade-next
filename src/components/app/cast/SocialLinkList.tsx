import React from 'react';
import Image from 'next/image';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { colors } from '@/config/ui';
import SectionTitle from '@/components/app/common/SectionTitle';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    padding: theme.spacing(0, 2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0),
    },
  },
  linkContainer: {
    [theme.breakpoints.down('sm')]: {
      borderBottom: `1px dashed ${colors.gray}`,
    },
  },
  linkItem: {
    padding: theme.spacing(2, 0),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textDecoration: 'none',
    '&:hover': {
      opacity: 0.7,
    },
  },
  linkText: {
    marginLeft: theme.spacing(1),
    color: colors.brownText,
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      fontWeight: 500,
    },
  },
}));

type Props = {
  twitter: string;
  youtube: string;
  youtubeSecond?: string | null;
  twitcasting?: string | null;
  tiktok?: string | null;
  niconico?: string | null;
};

const SocialLinkList = React.memo<Props>(
  ({ twitter, youtube, youtubeSecond, tiktok, twitcasting, niconico }) => {
    const isSm = useMediaQuery('(max-width: 960px)');
    const classes = useStyles();
    return (
      <div>
        <SectionTitle title="SNSリンク" subTitle="Social links" />
        <div className={classes.container}>
          <div className={classes.linkContainer}>
            <a
              href={`https://twitter.com/${twitter}`}
              target="_blank"
              rel="noreferrer noopener"
              className={classes.linkItem}
            >
              <div className={classes.flex}>
                <Image
                  src="/twitter_circle.png"
                  width={isSm ? 32 : 40}
                  height={isSm ? 32 : 40}
                />
                <span className={classes.linkText}>Twitterアカウント</span>
              </div>
              {!isSm && (
                <ArrowRightIcon htmlColor={colors.border} fontSize="large" />
              )}
            </a>
            {!isSm && <Divider />}
          </div>
          <div className={classes.linkContainer}>
            <a
              href={`https://www.youtube.com/channel/${youtube}`}
              target="_blank"
              rel="noreferrer noopener"
              className={classes.linkItem}
            >
              <div className={classes.flex}>
                <Image
                  src="/youtube_circle.png"
                  width={isSm ? 32 : 40}
                  height={isSm ? 32 : 40}
                />
                <span className={classes.linkText}>YouTubeチャンネル</span>
              </div>
              {!isSm && (
                <ArrowRightIcon htmlColor={colors.border} fontSize="large" />
              )}
            </a>
          </div>
          {youtubeSecond && (
            <>
              {!isSm && <Divider />}
              <div className={classes.linkContainer}>
                <a
                  href={`https://www.youtube.com/channel/${youtubeSecond}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={classes.linkItem}
                >
                  <div className={classes.flex}>
                    <Image
                      src="/youtube_circle.png"
                      width={isSm ? 32 : 40}
                      height={isSm ? 32 : 40}
                    />
                    <span className={classes.linkText}>
                      Youtube2ndチャンネル
                    </span>
                  </div>
                  {!isSm && (
                    <ArrowRightIcon
                      htmlColor={colors.border}
                      fontSize="large"
                    />
                  )}
                </a>
              </div>
            </>
          )}
          {twitcasting && (
            <>
              {!isSm && <Divider />}
              <div className={classes.linkContainer}>
                <a
                  href={`https://twitcasting.tv/${twitcasting}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={classes.linkItem}
                >
                  <div className={classes.flex}>
                    <Image
                      src="/twitcasting_circle.png"
                      width={isSm ? 32 : 40}
                      height={isSm ? 32 : 40}
                    />
                    <span className={classes.linkText}>
                      ツイキャスアカウント
                    </span>
                  </div>
                  {!isSm && (
                    <ArrowRightIcon
                      htmlColor={colors.border}
                      fontSize="large"
                    />
                  )}
                </a>
              </div>
            </>
          )}
          {tiktok && (
            <>
              {!isSm && <Divider />}
              <div className={classes.linkContainer}>
                <a
                  href={`https://www.tiktok.com/@${tiktok}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={classes.linkItem}
                >
                  <div className={classes.flex}>
                    <Image
                      src="/tiktok_circle.png"
                      width={isSm ? 32 : 40}
                      height={isSm ? 32 : 40}
                    />
                    <span className={classes.linkText}>TikTokアカウント</span>
                  </div>
                  {!isSm && (
                    <ArrowRightIcon
                      htmlColor={colors.border}
                      fontSize="large"
                    />
                  )}
                </a>
              </div>
            </>
          )}
          {niconico && (
            <>
              {!isSm && <Divider />}
              <div className={classes.linkContainer}>
                <a
                  href={`https://ch.nicovideo.jp/${niconico}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={classes.linkItem}
                >
                  <div className={classes.flex}>
                    <Image
                      src="/niconico.png"
                      width={isSm ? 32 : 40}
                      height={isSm ? 32 : 40}
                    />
                    <span className={classes.linkText}>ニコニコチャンネル</span>
                  </div>
                  {!isSm && (
                    <ArrowRightIcon
                      htmlColor={colors.border}
                      fontSize="large"
                    />
                  )}
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    );
  },
);

export default SocialLinkList;
