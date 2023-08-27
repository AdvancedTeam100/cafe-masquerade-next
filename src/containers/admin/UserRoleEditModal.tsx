import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Modal from '@/components/common/Modal';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { ThunkDispatch } from '@/store';
import { userListOperations, userListSelectors } from '@/store/admin/userList';
import { colors } from '@/config/ui';
import {
  User,
  UserRole,
  userRoleToDisplayName,
  userRoles,
} from '@/libs/models/user';
import FormActions from '@/components/form/Actions';
import RoleIcon from '@/components/common/RoleIcon';

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
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  flexEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  dangerText: {
    margin: theme.spacing(3, 0),
    color: colors.grayText,
    cursor: 'pointer',
  },
}));

type Props = {
  user: User;
  isOpened: boolean;
  handleClose: () => void;
};

const UserEditModal: React.FC<Props> = ({ user, isOpened, handleClose }) => {
  const classes = useStyles();
  const { updatingUserIds } = useSelector(userListSelectors.state);
  const dispatch = useDispatch<ThunkDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const [errorMessage, setErrorMessage] = useState('');
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<{ role: UserRole }>({
    mode: 'onBlur',
  });

  const getList = useCallback(() => {
    dispatch(userListOperations.get());
  }, [dispatch]);

  const update = useCallback(
    (params: { role: UserRole }) => {
      dispatch(
        userListOperations.updateRole(
          user.uid,
          params.role,
          () => {
            enqueueSnackbar('ユーザーの会員ランクを更新しました', {
              variant: 'success',
            });
            handleClose();
            reset();
            getList();
          },
          (error: string) => {
            enqueueSnackbar('ユーザーの会員ランクの更新に失敗しました', {
              variant: 'error',
            });
            setErrorMessage(error);
          },
        ),
      );
    },
    [dispatch, enqueueSnackbar, reset, handleClose, getList, user.uid],
  );

  const onSubmit = handleSubmit((data) => {
    setErrorMessage('');
    update(data);
  });

  return (
    <Modal
      ariaLabel="ls-update-title"
      ariaDescription="ls-update-description"
      isOpened={isOpened}
      onClose={handleClose}
    >
      <div className={classes.container}>
        <div className={classes.header}>
          <h3 className={classes.title}>会員ランクを編集</h3>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider />
        <div className={classes.formContainer}>
          <form onSubmit={onSubmit}>
            <span>{user.displayName}さんの会員ランクを更新します</span>
            <div className={classes.formControl}>
              <Controller
                name="role"
                control={control}
                defaultValue={user.role ?? ''}
                render={({ field }) => (
                  <Select {...field} displayEmpty>
                    <MenuItem value="" disabled>
                      会員ランクを選択してください
                    </MenuItem>
                    {userRoles.map((role) => (
                      <MenuItem value={role} key={role}>
                        <span className={classes.flex}>
                          <RoleIcon role={role} />
                          <span style={{ marginLeft: '4px' }}>
                            {userRoleToDisplayName[role]}
                          </span>
                        </span>
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </div>
            {errorMessage && (
              <p className={classes.errorMessage}>{errorMessage}</p>
            )}
            <div className={classes.flexEnd}>
              <FormActions
                submitText="送信する"
                isDisabled={updatingUserIds.includes(user.uid) || !isDirty}
                isLoading={updatingUserIds.includes(user.uid)}
              />
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default UserEditModal;
