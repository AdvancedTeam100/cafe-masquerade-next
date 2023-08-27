import { memo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { colors } from '@/config/ui';

const useStyles = makeStyles((theme) => ({
  button: {
    color: colors.brownText,
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      backgroundColor: `${colors.backgroundYellow} !important`,
      fontWeight: 500,
      padding: '16px',
    },
  },
  menuItem: {
    color: colors.brownText,
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      backgroundColor: `${colors.backgroundYellow} !important`,
      fontWeight: 500,
    },
  },
  selectedMenuItem: {
    backgroundColor: `${colors.backgroundYellow} !important`,
    [theme.breakpoints.down('sm')]: {
      backgroundColor: 'rgba(0, 0, 0, 0.08) !important',
    },
  },
}));

type Props = {
  componentKey: string;
  buttonText: string;
  currentValue: string;
  items: {
    label: string;
    value: string;
  }[];
  onClickItem: (value: string) => void;
};

const VideoFilterForm = memo<Props>(
  ({ componentKey, currentValue, buttonText, items, onClickItem }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClickButton = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleClickItem = (value: string) => {
      onClickItem(value);
      handleClose();
    };

    return (
      <>
        <Button
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClickButton}
          endIcon={<KeyboardArrowDownIcon />}
          className={classes.button}
        >
          {buttonText}
        </Button>
        <Menu
          id={componentKey}
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          classes={{
            list: classes.menuItem,
          }}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
            },
          }}
        >
          {items.map((item) => (
            <MenuItem
              key={`filter-selector-${item.value}`}
              selected={currentValue === item.value}
              onClick={() => handleClickItem(item.value)}
              className={classes.menuItem}
              classes={{
                selected: classes.selectedMenuItem,
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  },
);

export default VideoFilterForm;
