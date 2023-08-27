import React from 'react';
import Link from 'next/link';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import { APP_MAX_WIDTH, buttonSquare, colors } from '@/config/ui';
import { headerLinkItems } from '@/config/appHeaderLinkItem';
import { useAuth } from '@/hooks/auth';
import HeaderAvatar from '@/components/common/HeaderAvatar';

type Props = {
  onClickExpandIcon: () => void;
  skipCheckAuth?: boolean;
};

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: colors.backgroundWhite,
    boxShadow: 'none',
    borderRadius: '0px !important',
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 auto',
    width: '100%',
    maxWidth: `${APP_MAX_WIDTH}px`,
    [theme.breakpoints.down('sm')]: {
      paddingRight: '0px',
    },
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  headerLinkItem: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(0, 1),
    textDecoration: 'none',
    '&:hover': {
      opacity: 0.7,
    },
  },
  headerLinkIcon: {
    width: '32px',
    height: '32px',
  },
  headerLinkText: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(0, 1),
    color: colors.brownText,
  },
  headerLinkTitle: {
    fontWeight: 700,
    fontSize: '13px',
  },
  headerLinkSubTitle: {
    fontWeight: 700,
    fontSize: '13px',
    fontFamily: '"Libre Baskerville", serif',
  },
  loginButton: {
    ...buttonSquare.pink,
    padding: '6px 16px',
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: {
      padding: '6px 14px',
      fontSize: '0.9rem',
    },
  },
}));

const Header = React.memo<Props>(({ onClickExpandIcon, skipCheckAuth }) => {
  const isSm = useMediaQuery('(max-width: 960px)');
  const classes = useStyles();
  const { user, isFetching, signOut } = skipCheckAuth
    ? { user: null, isFetching: false, signOut: () => {} }
    : useAuth();

  return (
    <AppBar className={classes.appBar} color="inherit" position="fixed">
      <Toolbar className={classes.toolbar}>
        <Link href="/">
          <a href="/">
            <div className={classes.logo}>
              <img
                src={isSm ? '/svg/logo_sm.svg' : '/svg/logo.svg'}
                alt="ますかれーど"
              />
            </div>
          </a>
        </Link>
        {isSm ? (
          <div>
            {typeof window !== 'undefined' && !user && !isFetching && (
              <Link
                href={`/login?redirect_url=${window.location.origin}${window.location.pathname}`}
                passHref
              >
                <Button
                  className={classes.loginButton}
                  variant="contained"
                  color="primary"
                >
                  ログイン
                </Button>
              </Link>
            )}
            <IconButton onClick={onClickExpandIcon}>
              <img src="/svg/menu_sm.svg" alt="-" />
            </IconButton>
          </div>
        ) : (
          <div className={classes.linkContainer}>
            {headerLinkItems.map((item) => (
              <Link href={item.href} key={item.href}>
                <a href={item.href} className={classes.headerLinkItem}>
                  <img
                    src={item.iconPath}
                    alt={item.title}
                    className={classes.headerLinkIcon}
                  />
                  <div className={classes.headerLinkText}>
                    <span className={classes.headerLinkTitle}>
                      {item.title}
                    </span>
                    <span className={classes.headerLinkSubTitle}>
                      {item.subTitle}
                    </span>
                  </div>
                </a>
              </Link>
            ))}
            {typeof window !== 'undefined' &&
              (user ? (
                <HeaderAvatar authUser={user} signOut={signOut} />
              ) : (
                !isFetching && (
                  <Link
                    href={`/login?redirect_url=${window.location.origin}${window.location.pathname}`}
                    passHref
                  >
                    <Button
                      className={classes.loginButton}
                      variant="contained"
                      color="primary"
                    >
                      ログイン
                    </Button>
                  </Link>
                )
              ))}
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
});

export default Header;
