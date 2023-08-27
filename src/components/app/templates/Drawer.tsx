import React from 'react';
import Link from 'next/link';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { headerLinkItems } from '@/config/appHeaderLinkItem';
import { colors } from '@/config/ui';
import { useAuth } from '@/hooks/auth';
import { ContentSideLink } from '@/libs/models/content';
import { userRoleToDisplayName } from '@/libs/models/user';
import RoleIcon from '@/components/common/RoleIcon';

type Props = {
  sideLinks: ContentSideLink[];
  onCloseDrawer: () => void;
  skipCheckAuth?: boolean;
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '250px',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  side: {
    width: '20px',
    height: '100%',
    backgroundImage: 'url("/drawer_side.png")',
  },
  main: {
    width: '100%',
    padding: theme.spacing(0, 1),
  },
  userContainer: {
    margin: '16px auto 0',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  userName: {
    fontWeight: 500,
    color: colors.brownText,
    wordBreak: 'break-all',
  },
  role: {
    backgroundColor: colors.backgroundBrown,
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    width: 'fit-content',
    margin: '4px 2px',
    padding: '0 4px',
    '& img': {
      marginBottom: '2px',
    },
  },
  logoContainer: {
    margin: '4px auto 0',
    width: '160px',
    textAlign: 'center',
  },
  linkItem: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 0),
    textDecoration: 'none',
    '&:hover': {
      opacity: 0.7,
    },
  },
  linkSideItem: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 0),
    textDecoration: 'none',
    '&:hover': {
      opacity: 0.7,
    },
  },
  linkIcon: {
    width: '20px',
    height: '20px',
    marginRight: theme.spacing(1),
  },
  linkSideIcon: {
    width: '16px',
    height: '16px',
    marginRight: theme.spacing(1),
  },
  linkText: {
    color: colors.brownText,
    fontWeight: 700,
  },
  linkTitle: {
    fontWeight: 700,
    fontSize: '16px',
  },
  linkSideTitle: {
    fontWeight: 700,
    fontSize: '14px',
  },
  linkSubTitle: {
    fontWeight: 700,
    opacity: 0.5,
    fontFamily: '"Libre Baskerville", serif',
    marginLeft: theme.spacing(1),
    fontSize: '12px',
  },
}));

const SmDrawer = React.memo<Props>(
  ({ sideLinks, onCloseDrawer, skipCheckAuth }) => {
    const classes = useStyles();
    const { user, signOut } = skipCheckAuth
      ? { user: null, signOut: () => {} }
      : useAuth();

    return (
      <div
        className={classes.container}
        role="presentation"
        onClick={onCloseDrawer}
      >
        <div className={classes.side} />
        <div className={classes.main}>
          {user ? (
            <div className={classes.userContainer}>
              <Avatar alt="avatar" src={user.avatarUrl ?? ''} />
              <div style={{ marginLeft: '4px' }}>
                <div className={classes.userName}>
                  {user.displayName.length > 10
                    ? `${user.displayName.slice(0, 10)}…`
                    : user.displayName}
                </div>
                <div className={classes.role}>
                  {userRoleToDisplayName[user.role]}
                  <span style={{ margin: '0 4px', height: '14px' }}>
                    <RoleIcon role={user.role} size={14} />
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className={classes.logoContainer}>
              <img src="/svg/logo_drawer_sm.svg" alt="ますかれーど" />
            </div>
          )}
          <List>
            {headerLinkItems.map((item) => (
              <div key={item.href}>
                <Link href={item.href}>
                  <a href={item.href} className={classes.linkItem}>
                    <img
                      src={item.iconPath}
                      alt={item.title}
                      className={classes.linkIcon}
                    />
                    <div className={classes.linkText}>
                      <span className={classes.linkTitle}>{item.title}</span>
                      <span className={classes.linkSubTitle}>
                        {item.subTitle}
                      </span>
                    </div>
                  </a>
                </Link>
                <Divider />
              </div>
            ))}
          </List>
          <List>
            {sideLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={classes.linkSideItem}
                target="_blank"
                rel="noreferrer noopener"
              >
                <img
                  src="/icon_sideitem.png"
                  alt={item.title}
                  className={classes.linkSideIcon}
                />
                <div className={classes.linkText}>
                  <span className={classes.linkSideTitle}>{item.title}</span>
                </div>
              </a>
            ))}
          </List>
          <List>
            <Divider />
            {user ? (
              <>
                <Link href="/settings/account" passHref>
                  <a className={classes.linkSideItem}>
                    <div className={classes.linkText}>
                      <span className={classes.linkSideTitle}>
                        アカウント設定
                      </span>
                    </div>
                  </a>
                </Link>
                <span className={classes.linkSideItem} onClick={signOut}>
                  <div className={classes.linkText}>
                    <span className={classes.linkSideTitle}>ログアウト</span>
                  </div>
                </span>
              </>
            ) : (
              typeof window !== 'undefined' && (
                <>
                  <Link
                    href={`/login?redirect_url=${window.location.origin}${window.location.pathname}`}
                    passHref
                  >
                    <a className={classes.linkSideItem}>
                      <div className={classes.linkText}>
                        <span className={classes.linkSideTitle}>ログイン</span>
                      </div>
                    </a>
                  </Link>
                  <Link
                    href={`/signup?redirect_url=${window.location.origin}${window.location.pathname}`}
                    passHref
                  >
                    <a className={classes.linkSideItem}>
                      <div className={classes.linkText}>
                        <span className={classes.linkSideTitle}>
                          新規アカウント作成
                        </span>
                      </div>
                    </a>
                  </Link>
                </>
              )
            )}
          </List>
        </div>
        <div className={classes.side} />
      </div>
    );
  },
);

export default SmDrawer;
