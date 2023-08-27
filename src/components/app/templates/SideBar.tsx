import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { ContentSideLink } from '@/libs/models/content';
import { colors } from '@/config/ui';

type Props = {
  sideLinks: ContentSideLink[];
  additionalSideComponents?: Array<React.ReactNode | undefined>;
};

const useStyles = makeStyles((theme) => ({
  container: {},
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  bannerContainer: {
    marginBottom: theme.spacing(4),
    '& img': {
      borderRadius: '12px',
    },
  },
  sideLinkContainer: {
    padding: theme.spacing(0, 2),
    marginBottom: theme.spacing(4),
  },
  sideLinkItem: {
    padding: theme.spacing(2, 0),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textDecoration: 'none',
    '&:hover': {
      opacity: 0.7,
    },
  },
  sideLinkIcon: {
    width: '40px',
    height: '40px',
  },
  sideLinkText: {
    marginLeft: theme.spacing(1),
    color: colors.brownText,
    fontWeight: 700,
  },
  sideItem: {
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(4),
  },
}));

const SideBar = ({ sideLinks, additionalSideComponents }: Props) => {
  const isSm = useMediaQuery('(max-width: 960px)');
  const classes = useStyles();

  return (
    <div>
      {!isSm && (
        <>
          {/* 再度募集をかける場合があるので，コメントアウトしておく */}
          {/* <Paper className={classes.bannerContainer}>
            <Link href="/recruit" passHref>
              <a style={{ display: 'block' }}>
                <Image
                  src="/banner_recruit_md.png"
                  width={432}
                  height={360}
                  objectFit="cover"
                  layout="responsive"
                />
              </a>
            </Link>
          </Paper> */}
          <Paper className={classes.sideLinkContainer}>
            {sideLinks.map((link, i) => (
              <div key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={classes.sideLinkItem}
                >
                  <div className={classes.flex}>
                    <img
                      src="/icon_sideitem.png"
                      alt={link.title}
                      className={classes.sideLinkIcon}
                    />
                    <span className={classes.sideLinkText}>{link.title}</span>
                  </div>
                  <ArrowRightIcon htmlColor={colors.border} fontSize="large" />
                </a>
                {i !== sideLinks.length - 1 && <Divider />}
              </div>
            ))}
          </Paper>
        </>
      )}
      {additionalSideComponents &&
        additionalSideComponents.map(
          (additionalSideComponent, i) =>
            additionalSideComponent && (
              <Paper
                key={`additionalSideComponent-${i}`}
                className={classes.sideItem}
              >
                {additionalSideComponent}
              </Paper>
            ),
        )}
    </div>
  );
};

export default SideBar;
