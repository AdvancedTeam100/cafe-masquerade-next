import React from 'react';
import { Theme, makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles<
  Theme,
  { hasBorderRadius: boolean; hasBlur: boolean }
>((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:focus': {
      outline: 'none',
    },
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: ({ hasBorderRadius }) => (hasBorderRadius ? '12px' : '0'),
    '&:focus': {
      outline: 'none',
    },
  },
  backdropRoot: {
    backdropFilter: ({ hasBlur }) => (hasBlur ? 'blur(10px)' : 'none'),
    backgroundColor: ({ hasBlur }) =>
      hasBlur ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.45)',
  },
}));

type Props = {
  ariaLabel: string;
  ariaDescription: string;
  isOpened: boolean;
  onClose: () => void;
  hasBorderRadius?: boolean;
  hasBlur?: boolean;
  disableBackdropClick?: boolean;
};

const ModalComponent: React.FC<Props> = ({
  ariaLabel,
  ariaDescription,
  isOpened,
  onClose,
  hasBorderRadius = false,
  hasBlur = false,
  disableBackdropClick,
  children,
}) => {
  const classes = useStyles({ hasBorderRadius, hasBlur });
  return (
    <Modal
      aria-labelledby={ariaLabel}
      aria-describedby={ariaDescription}
      className={classes.modal}
      open={isOpened}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        classes: {
          root: classes.backdropRoot,
        },
      }}
      disableBackdropClick={disableBackdropClick}
    >
      <Fade in={isOpened}>
        <div className={classes.paper}>{children}</div>
      </Fade>
    </Modal>
  );
};

export default ModalComponent;
