import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { fontFamily } from '@/config/ui';
import { Quality } from '@/containers/video/VideoQualitySelector';

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
  qualities: Quality[];
  currentQuality: Quality;
  setQuality: (quality: Quality) => void;
  closeMenu: () => void;
  toggleMenu: () => void;
};

const QualityMenu = memo<Props>(
  ({ qualities, currentQuality, setQuality, closeMenu, toggleMenu }) => {
    const classes = useStyles();

    return (
      <>
        <MenuItem onClick={toggleMenu} className={classes.menuTitle}>
          <div className={classes.menuTitleWrapper}>
            <ArrowBackIosIcon className={classes.menuItemSvg} />
            <p className={classes.menuTitleContent}>画質</p>
          </div>
        </MenuItem>
        {qualities.map((quality) => (
          <MenuItem
            key={`quality-${quality}`}
            onClick={() => {
              setQuality(quality);
              closeMenu();
            }}
            className={classes.menuItem}
            style={{
              backgroundColor:
                quality === currentQuality
                  ? 'rgb(255 255 255 / 22%)'
                  : 'inherit',
            }}
          >
            {quality === 'auto' ? '自動' : `${quality}p`}
          </MenuItem>
        ))}
      </>
    );
  },
);

export default QualityMenu;
