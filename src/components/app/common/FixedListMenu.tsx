import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { colors } from '@/config/ui';

type Props = {
  items: {
    text: React.ReactNode;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    shouldCloseClicking?: boolean;
  }[];
  buttonColor?: string;
  textColor?: string;
  iconButtonSize?: 'small' | 'medium';
};

const ListMenu = React.memo<Props>(
  ({
    items,
    buttonColor = colors.border,
    textColor = colors.brown,
    iconButtonSize = 'medium',
  }) => {
    const [anchorEl, setAnchorEl] = React.useState<
      (EventTarget & HTMLButtonElement) | null
    >(null);

    const handleOpenMenu = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setAnchorEl(null);
    };

    return (
      <>
        <IconButton
          aria-controls={'list-menu'}
          aria-haspopup="true"
          onClick={handleOpenMenu}
          size={iconButtonSize}
        >
          <MoreVertIcon htmlColor={buttonColor} />
        </IconButton>
        <Menu
          id={'list-menu'}
          elevation={2}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {items.map((item, i) => (
            <MenuItem
              onClick={(event) => {
                item.onClick();
                if (item.shouldCloseClicking) {
                  handleClose(event);
                }
              }}
              disabled={item.disabled}
              key={`list-menu-item-${i}`}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {item.icon && (
                  <span style={{ marginRight: '8px', height: '18px' }}>
                    {item.icon}
                  </span>
                )}
                <span style={{ color: textColor, fontWeight: 500 }}>
                  {item.text}
                </span>
              </div>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  },
);

export default ListMenu;
