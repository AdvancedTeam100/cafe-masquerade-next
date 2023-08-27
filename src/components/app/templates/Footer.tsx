import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { FOOTER_MAX_WIDTH, colors } from '@/config/ui';
import {
  mdFooterLinkItems,
  smFooterLinkItems,
  termsAndPrivacyLinkItems,
} from '@/config/appFooterLinkItem';

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(6, 8, 3),
    zIndex: theme.zIndex.drawer + 1,
    background: colors.backgroundFooter,
    boxShadow: 'none',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  container: {
    maxWidth: `${FOOTER_MAX_WIDTH}px`,
    margin: '0 auto',
  },
  linkContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(4),
    },
  },
  linkSectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(1),
    },
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: colors.footerLinkText,
    textDecoration: 'none',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      borderBottom: `1px solid ${colors.footerLinkText}`,
      padding: theme.spacing(2, 1),
    },
    [theme.breakpoints.down('md')]: {
      marginRight: theme.spacing(1),
    },
  },
  linkText: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: 500,
    '&:hover': {
      opacity: 0.7,
    },
  },
  smBottomLink: {
    display: 'block',
    color: colors.footerLinkText,
    textDecoration: 'none',
    textAlign: 'center',
    marginTop: theme.spacing(4),
    '&:hover': {
      opacity: 0.7,
    },
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2, 0),
  },
  circleLink: {
    margin: '2px',
    '&:hover': {
      opacity: 0.7,
    },
  },
  footerText: {
    color: colors.backgroundWhite,
    margin: '12px auto',
    textAlign: 'center',
  },
}));

type Props = {
  additionalLinks: {
    title: string;
    href: string;
  }[];
};

const LinkItem = React.memo<{ link: { title: string; href: string } }>(
  ({ link }) => {
    const isSm = useMediaQuery('(max-width: 960px)');
    const classes = useStyles();
    return (
      <Link href={link.href} passHref>
        <a className={classes.link}>
          <div className={classes.linkText}>
            {isSm ? (
              `＊${' '}`
            ) : (
              <ArrowRightIcon htmlColor={colors.footerLinkText} />
            )}
            {link.title}
          </div>
          {isSm && <div>〉</div>}
        </a>
      </Link>
    );
  },
);

const Footer = React.memo<Props>(({ additionalLinks }) => {
  const isSm = useMediaQuery('(max-width: 960px)');
  const classes = useStyles();

  const defauktLinks = isSm ? smFooterLinkItems : mdFooterLinkItems;

  return (
    <footer className={classes.footer}>
      <Grid container className={classes.container}>
        {!isSm && (
          <Grid item md={3}>
            <img src="/svg/logo_md_footer.svg" alt="ますかれーど" />
          </Grid>
        )}
        <Grid item md={8} xs={12}>
          <div className={classes.linkContainer}>
            <div className={classes.linkSectionContainer}>
              {defauktLinks.map((link) => (
                <LinkItem link={link} key={`footer-link-${link.title}`} />
              ))}
            </div>
            <div className={classes.linkSectionContainer}>
              {additionalLinks.map((link) => (
                <LinkItem link={link} key={`footer-link-${link.title}`} />
              ))}
            </div>
            <div className={classes.linkSectionContainer}>
              {termsAndPrivacyLinkItems.map((link) => (
                <LinkItem link={link} key={`footer-link-${link.title}`} />
              ))}
            </div>
          </div>
          <Grid container>
            <Grid item md={8} xs={12}>
              {isSm && (
                <Link href="/contact" passHref>
                  <a className={classes.smBottomLink}>お問い合わせ</a>
                </Link>
              )}
              <div className={classes.iconContainer}>
                <a
                  className={classes.circleLink}
                  href="https://www.youtube.com/channel/UCS2Dg5p3hplqjR8DamlW1eg"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Image src="/youtube_circle.png" width={40} height={40} />
                </a>
                <a
                  className={classes.circleLink}
                  href="https://twitter.com/masquerade_ch"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Image src="/twitter_circle.png" width={40} height={40} />
                </a>
                <a
                  className={classes.circleLink}
                  href="https://ci-en.dlsite.com/creator/7561"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Image src="/cien_circle.png" width={40} height={40} />
                </a>
              </div>
              <p className={classes.footerText}>©︎masquerade</p>
            </Grid>
            <Grid item md={8} xs={12} />
          </Grid>
        </Grid>
      </Grid>
    </footer>
  );
});

export default Footer;
