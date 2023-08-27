import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

type Props = {
  submitText: string;
  isDisabled: boolean;
  isLoading: boolean;
  submitButtonClass?: string;
  cancelButtonClass?: string;
  handleCancel?: () => void;
  cancelText?: string;
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}));

const FormActions = React.memo<Props>(
  ({
    submitText,
    isDisabled,
    isLoading,
    handleCancel,
    submitButtonClass,
    cancelButtonClass,
    cancelText,
  }) => {
    const classes = useStyles();
    return (
      <div className={classes.container}>
        {handleCancel && (
          <Button
            className={cancelButtonClass}
            variant="contained"
            color="inherit"
            onClick={handleCancel}
          >
            {cancelText ?? 'キャンセル'}
          </Button>
        )}
        <Button
          className={submitButtonClass}
          variant="contained"
          color="primary"
          type="submit"
          disabled={isDisabled}
          startIcon={isLoading && <CircularProgress size={16} />}
        >
          {submitText}
        </Button>
      </div>
    );
  },
);

export default FormActions;
