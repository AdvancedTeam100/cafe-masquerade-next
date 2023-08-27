import { memo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { fontFamily } from '@/config/ui';

const useStyles = makeStyles((theme) => ({
  menuTitle: {
    borderBottom: '1px solid rgb(255 255 255 / 50%)',
    fontSize: '14px',
    fontFamily,
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
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  menuSvgWrapper: {
    paddingTop: '2px',
  },
  menuTitleContent: {
    padding: '0 4px',
  },
  menuItem: {
    fontWeight: 300,
    fontFamily,
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
  currentPlaybackRate: number;
  playbackRates: number[];
  closeSpeedMenu: () => void;
  toggleMenu: () => void;
  setPlaybackRate?: (playbackRate: number) => void;
};

const SpeedMenu = memo<Props>(
  ({
    currentPlaybackRate,
    playbackRates,
    setPlaybackRate,
    closeSpeedMenu,
    toggleMenu,
  }) => {
    const classes = useStyles();

    return (
      <>
        <MenuItem className={classes.menuTitle} onClick={() => toggleMenu()}>
          <div className={classes.menuTitleWrapper}>
            <ArrowBackIosIcon className={classes.menuItemSvg} />
            <p className={classes.menuTitleContent}>再生速度</p>
          </div>
        </MenuItem>
        {playbackRates.map((playbackRate) => (
          <MenuItem
            key={`playbackRate-${playbackRate}`}
            onClick={() => {
              setPlaybackRate && setPlaybackRate(playbackRate);
              closeSpeedMenu();
            }}
            className={classes.menuItem}
            style={{
              backgroundColor:
                playbackRate === currentPlaybackRate
                  ? 'rgb(255 255 255 / 22%)'
                  : 'inherit',
            }}
          >
            {playbackRate === 1 ? '標準' : `${playbackRate}`}
          </MenuItem>
        ))}
      </>
    );
  },
);

export default SpeedMenu;
