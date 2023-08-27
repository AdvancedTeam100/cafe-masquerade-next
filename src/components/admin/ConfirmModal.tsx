import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@/components/common/Modal';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '550px',
    padding: theme.spacing(2),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '1.2rem',
    margin: theme.spacing(1, 0),
  },
}));

type Props = {
  isOpened: boolean;
  title: string;
  content?: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText: string;
  cancelText?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
};

const ConfirmModal = memo<Props>(
  ({
    isOpened,
    title,
    content,
    onConfirm,
    onClose,
    confirmText,
    cancelText,
    isLoading,
    isDisabled,
  }) => {
    const classes = useStyles();

    return (
      <Modal
        ariaLabel="confirm-modal-title"
        ariaDescription="confirm-modal-description"
        isOpened={isOpened}
        onClose={onClose}
        disableBackdropClick={true}
      >
        <div className={classes.container}>
          <div className={classes.header}>
            <h3 className={classes.title}>{title}</h3>
          </div>
          {content && <p>{content}</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {cancelText && (
              <Button
                variant="outlined"
                color="default"
                onClick={onClose}
                style={{ marginRight: '8px' }}
                disabled={isDisabled}
              >
                {cancelText}
              </Button>
            )}
            <Button
              variant="contained"
              onClick={onConfirm}
              color="primary"
              startIcon={isLoading && <CircularProgress size={16} />}
              disabled={isDisabled}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </Modal>
    );
  },
);

export default ConfirmModal;
