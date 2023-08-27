import { memo, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { Quality } from '@/containers/video/VideoQualitySelector';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';
import TuneIcon from '@material-ui/icons/Tune';
import SlowMotionVideoOutlinedIcon from '@material-ui/icons/SlowMotionVideoOutlined';
import SpeedMenu from './SpeedMenu';
import QualityMenu from './QualityMenu';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  configIcon: {
    width: '24px !important',
    height: '24px !important',
  },
  menuContainer: {
    [theme.breakpoints.up('md')]: {
      top: '-4px !important',
    },
  },
  menuList: {
    width: '200px',
    backgroundColor: 'rgb(12 12 12 / 75%)',
    color: 'white',
    '& ul': {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  menuTitle: {
    borderBottom: '1px solid rgb(255 255 255 / 50%)',
    fontSize: '14px',
    paddingTop: 0,
    paddingBottom: 0,
    height: '42px',
    minHeight: 'unset',
    display: 'flex',
    justifyContent: 'space-between',
    '&:hover': {
      backgroundColor: 'rgb(255 255 255 / 22%) !important',
    },
  },
  menuTitleSvg: {
    height: '24px !important',
    width: '24px !important',
  },
  menuTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  menuTitleContent: {
    padding: '0 4px',
  },
  menuItem: {
    fontWeight: 300,
    fontSize: '14px',
    padding: theme.spacing(1.5, 2),
    '&:hover': {
      backgroundColor: 'rgb(255 255 255 / 22%) !important',
    },
  },
  menuItemSvg: {
    width: '16px !important',
    height: '16px !important',
  },
}));

type Props = {
  qualities: Quality[];
  currentQuality: Quality;
  currentPlaybackRate: number;
  setQuality: (quality: Quality) => void;
  setPlaybackRate?: (playbackRate: number) => void;
  toggleConfigTooltip?: (isOpen: boolean) => void;
};

const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2];

const ConfigMenu = memo<Props>(
  ({
    qualities,
    currentQuality,
    currentPlaybackRate,
    setQuality,
    setPlaybackRate,
    toggleConfigTooltip,
  }) => {
    const classes = useStyles();
    const isSm = useMediaQuery('(max-width: 960px)');
    const [isOpened, setIsOpened] = useState(false);
    const [isQualityMenuOpened, setIsQualityMenuOpened] = useState(false);
    const [isSpeedMenuOpened, setIsSpeedMenuOpened] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    const handleClose = (event: React.MouseEvent<EventTarget>) => {
      if (
        anchorRef.current &&
        anchorRef.current.contains(event.target as HTMLElement)
      ) {
        return;
      }

      setIsOpened(false);
      toggleConfigTooltip && toggleConfigTooltip(false);
      setIsQualityMenuOpened(false);
      setIsSpeedMenuOpened(false);
    };

    return (
      <div className={classes.container} ref={anchorRef}>
        <SettingsIcon
          fontSize="large"
          onClick={() => {
            setIsOpened(!isOpened);
            toggleConfigTooltip && toggleConfigTooltip(isOpened ? false : true);
          }}
          className={classes.configIcon}
        />
        <Popper
          open={isOpened}
          anchorEl={anchorRef.current}
          transition
          disablePortal
          placement={isSm ? 'bottom' : 'top'}
          className={classes.menuContainer}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper elevation={0} className={classes.menuList}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={isOpened} id="puality-menu-list">
                    {isQualityMenuOpened && (
                      <QualityMenu
                        qualities={qualities}
                        currentQuality={currentQuality}
                        setQuality={setQuality}
                        toggleMenu={() =>
                          setIsQualityMenuOpened(!isQualityMenuOpened)
                        }
                        closeMenu={() => setIsQualityMenuOpened(false)}
                      />
                    )}
                    {isSpeedMenuOpened && (
                      <SpeedMenu
                        currentPlaybackRate={currentPlaybackRate}
                        playbackRates={PLAYBACK_RATES}
                        toggleMenu={() =>
                          setIsSpeedMenuOpened(!isSpeedMenuOpened)
                        }
                        setPlaybackRate={setPlaybackRate}
                        closeSpeedMenu={() => setIsSpeedMenuOpened(false)}
                      />
                    )}
                    {!isQualityMenuOpened && !isSpeedMenuOpened && (
                      <>
                        <MenuItem
                          onClick={() =>
                            setIsQualityMenuOpened(!isQualityMenuOpened)
                          }
                          className={classes.menuTitle}
                        >
                          <div className={classes.menuTitleWrapper}>
                            <TuneIcon className={classes.menuTitleSvg} />
                            <p className={classes.menuTitleContent}>画質</p>
                          </div>
                          <div className={classes.menuTitleWrapper}>
                            <p>
                              {String(currentQuality) === 'auto'
                                ? '自動'
                                : `${currentQuality}p`}
                            </p>
                            <ArrowForwardIos
                              className={classes.menuItemSvg}
                              style={{ marginTop: '2px' }}
                            />
                          </div>
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            setIsSpeedMenuOpened(!isSpeedMenuOpened)
                          }
                          className={classes.menuTitle}
                        >
                          <div className={classes.menuTitleWrapper}>
                            <SlowMotionVideoOutlinedIcon
                              className={classes.menuTitleSvg}
                            />
                            <p className={classes.menuTitleContent}>再生速度</p>
                          </div>
                          <div className={classes.menuTitleWrapper}>
                            <p>
                              {currentPlaybackRate === 1
                                ? '標準'
                                : `${currentPlaybackRate}`}
                            </p>
                            <ArrowForwardIos className={classes.menuItemSvg} />
                          </div>
                        </MenuItem>
                      </>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  },
);

export default ConfigMenu;
