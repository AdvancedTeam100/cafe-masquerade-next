import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { colors } from '@/config/ui';

type Props = {
  items: {
    text: React.ReactNode;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
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
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<EventTarget>) => {
      if (
        anchorRef.current &&
        anchorRef.current.contains(event.target as HTMLElement)
      ) {
        return;
      }

      setOpen(false);
    };

    function handleListKeyDown(event: React.KeyboardEvent) {
      if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
      }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
      if (prevOpen.current === true && open === false) {
        anchorRef.current!.focus();
      }

      prevOpen.current = open;
    }, [open]);

    return (
      <>
        <IconButton
          aria-controls={'list-menu'}
          aria-haspopup="true"
          ref={anchorRef}
          onClick={handleToggle}
          size={iconButtonSize}
        >
          <MoreVertIcon htmlColor={buttonColor} />
        </IconButton>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
                zIndex: 1000,
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    {items.map((item, i) => (
                      <MenuItem
                        onClick={() => {
                          item.onClick();
                          setOpen(false);
                        }}
                        disabled={item.disabled}
                        key={`list-menu-item-${i}`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {item.icon && (
                            <span
                              style={{ marginRight: '8px', height: '18px' }}
                            >
                              {item.icon}
                            </span>
                          )}
                          <span style={{ color: textColor, fontWeight: 500 }}>
                            {item.text}
                          </span>
                        </div>
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    );
  },
);

export default ListMenu;
