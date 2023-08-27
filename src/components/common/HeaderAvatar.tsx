import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Avatar from '@material-ui/core/Avatar';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Divider from '@material-ui/core/Divider';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import { AuthUser } from '@/store/auth';
import { colors } from '@/config/ui';
import { isAdmin } from '@/libs/models/adminUser';

type Props = {
  authUser: AuthUser;
  signOut: () => void;
};

const useStyles = makeStyles((theme) => ({
  onboarding: {
    backgroundImage: 'url("/onboarding_message_background.png")',
    height: '160px',
    width: '240px',
    position: 'absolute',
    top: '48px',
    right: 0,
  },
  onboardingMessage: {
    margin: theme.spacing(5, 3, 1),
    color: colors.brownText,
    fontWeight: 700,
  },
  onboardingClose: {
    backgroundColor: colors.backgroundWhite,
    color: colors.brownText,
    fontWeight: 700,
    textAlign: 'center',
    width: '80px',
    padding: '4px',
    margin: '0 auto',
    borderRadius: '8px',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.9,
    },
  },
  menuMainItem: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  menuTextItem: {
    minWidth: '200px',
  },
  displayName: {
    fontSize: '14px',
    marginBottom: '2px',
  },
  email: {
    fontSize: '13px',
    color: '#666',
    marginTop: '2px',
  },
  menuText: {
    fontSize: '14px',
    padding: '4px 0',
    color: colors.brownText,
  },
}));

const HeaderAvatar = React.memo<Props>(({ authUser, signOut }) => {
  const classes = useStyles();
  const [isOpened, toggleMenu] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const anchorRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (router.query.onboarding !== undefined) {
      setShowOnboarding(true);
    }
  }, [router.query]);

  const onClickAvatar = () => {
    toggleMenu((prevOpen) => !prevOpen);
  };

  return (
    <>
      <Avatar
        alt="avatar"
        src={authUser.avatarUrl ?? ''}
        onClick={onClickAvatar}
        ref={anchorRef}
        style={{ cursor: 'pointer' }}
      />
      {showOnboarding && (
        <div className={classes.onboarding}>
          <p className={classes.onboardingMessage}>
            アカウント情報の修正はこちらの「アカウント設定」から行えます！
          </p>
          <div
            className={classes.onboardingClose}
            onClick={() => setShowOnboarding(false)}
          >
            閉じる
          </div>
        </div>
      )}
      <Popper
        open={isOpened}
        role={undefined}
        anchorEl={anchorRef.current}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={onClickAvatar}>
                <MenuList autoFocusItem={isOpened} id="menu-list-grow">
                  {isAdmin(authUser.role) ? (
                    <>
                      <MenuItem className={classes.menuMainItem}>
                        <p className={classes.displayName}>
                          {authUser.displayName}
                        </p>
                        <p className={classes.email}>{authUser.email}</p>
                      </MenuItem>
                      <Link href="/admin" passHref>
                        <MenuItem className={classes.menuTextItem}>
                          <span className={classes.menuText}>管理者ページ</span>
                        </MenuItem>
                      </Link>
                    </>
                  ) : (
                    <Link href="/settings/account" passHref>
                      <MenuItem className={classes.menuTextItem}>
                        <span className={classes.menuText}>アカウント設定</span>
                      </MenuItem>
                    </Link>
                  )}
                  <Divider />
                  <MenuItem
                    className={classes.menuTextItem}
                    onClick={() => {
                      signOut();
                      onClickAvatar();
                      router.push('/');
                    }}
                  >
                    <span className={classes.menuText}>ログアウト</span>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
});

export default HeaderAvatar;
