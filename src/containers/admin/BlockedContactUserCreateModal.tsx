import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Modal from '@/components/common/Modal';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { FormData, validationSchema } from '@/config/form/blockedContactUser';
import { ThunkDispatch } from '@/store';
import {
  BlockedContactUserCreateParams,
  blockedContactUserOperations,
  blockedContactUserSelectors,
} from '@/store/admin/blockedContactUser';
import { blockedContactUserListOperations } from '@/store/admin/blockedContactUserList';
import FormInput from '@/components/form/Input';
import FormActions from '@/components/form/Actions';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '550px',
  },
  header: {
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 500,
  },
  formContainer: {
    padding: theme.spacing(2),
  },
  formControl: {
    padding: theme.spacing(1.5, 0),
  },
  errorMessage: {
    color: theme.palette.error.main,
    margin: theme.spacing(1, 0),
  },
}));

type Props = {
  isOpened: boolean;
  handleClose: () => void;
};

const BlockedContactUserCreateModal: React.FC<Props> = ({
  isOpened,
  handleClose,
}) => {
  const classes = useStyles();
  const { isCreating } = useSelector(blockedContactUserSelectors.state);
  const dispatch = useDispatch<ThunkDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const [errorMessage, setErrorMessage] = useState('');
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  const getList = useCallback(() => {
    dispatch(blockedContactUserListOperations.get());
  }, [dispatch]);

  const create = useCallback(
    (params: BlockedContactUserCreateParams) => {
      dispatch(
        blockedContactUserOperations.create(
          params,
          () => {
            enqueueSnackbar('ユーザーをブロックしました', {
              variant: 'success',
            });
            handleClose();
            reset();
            getList();
          },
          (error: string) => {
            enqueueSnackbar('ユーザーのブロックに失敗しました', {
              variant: 'error',
            });
            setErrorMessage(error);
          },
        ),
      );
    },
    [dispatch, enqueueSnackbar, reset, handleClose, getList],
  );

  const onSubmit = handleSubmit((data) => {
    setErrorMessage('');
    const params: BlockedContactUserCreateParams = {
      ...data,
    };
    create(params);
  });

  return (
    <Modal
      ariaLabel="ls-create-title"
      ariaDescription="ls-create-description"
      isOpened={isOpened}
      onClose={handleClose}
    >
      <div className={classes.container}>
        <div className={classes.header}>
          <h3 className={classes.title}>ユーザーをブロック</h3>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider />
        <div className={classes.formContainer}>
          <form onSubmit={onSubmit}>
            <div className={classes.formControl}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormInput
                    field={field}
                    fieldError={errors?.email}
                    placeholder="メールアドレスを入力"
                    label="メールアドレス"
                    fullWidth={true}
                  />
                )}
              />
            </div>
            {errorMessage && (
              <p className={classes.errorMessage}>{errorMessage}</p>
            )}
            <FormActions
              submitText="ユーザーをブロック"
              isDisabled={isCreating}
              isLoading={isCreating}
            />
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default BlockedContactUserCreateModal;
