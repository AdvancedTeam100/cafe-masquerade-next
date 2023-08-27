import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Modal from '@/components/common/Modal';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { FormData, validationSchema } from '@/config/form/adminUser';
import { ThunkDispatch } from '@/store';
import {
  AdminUserParams,
  adminUserOperations,
  adminUserSelectors,
} from '@/store/admin/adminUser';
import { adminUserListOperations } from '@/store/admin/adminUserList';
import { castListSelectors } from '@/store/admin/castList';
import FormInput from '@/components/form/Input';
import FormImageInput from '@/components/form/ImageInput';
import FormActions from '@/components/form/Actions';
import {
  DEFAULT_ADMIN_ROLE,
  adminRoleToDisplayName,
  adminRoles,
} from '@/libs/models/adminUser';

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

const AdminUserCreateModal: React.FC<Props> = ({ isOpened, handleClose }) => {
  const classes = useStyles();
  const { isCreating } = useSelector(adminUserSelectors.state);
  const { castList } = useSelector(castListSelectors.state);
  const dispatch = useDispatch<ThunkDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const [errorMessage, setErrorMessage] = useState('');
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  const role = useWatch({ control, name: 'role' });
  const publicAvatar = useWatch({ control, name: 'publicAvatar' });

  const getList = useCallback(() => {
    dispatch(adminUserListOperations.get());
  }, [dispatch]);

  const create = useCallback(
    (params: AdminUserParams) => {
      dispatch(
        adminUserOperations.create(
          params,
          () => {
            enqueueSnackbar('管理者を追加しました', {
              variant: 'success',
            });
            handleClose();
            reset();
            getList();
          },
          (error: string) => {
            enqueueSnackbar('管理者の追加に失敗しました', {
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
    // NOTE: 1度キャストを選択するとcastIdが空文字で入るので削除する
    if (data.role !== 'cast' && data.castId) {
      const { castId: _, ...params } = data;
      create(params);
      return;
    }
    create(data);
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
          <h3 className={classes.title}>管理者を追加</h3>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider />
        <div className={classes.formContainer}>
          <form onSubmit={onSubmit}>
            <div className={classes.formControl}>
              <Controller
                name="role"
                control={control}
                defaultValue={DEFAULT_ADMIN_ROLE}
                render={({ field }) => (
                  <>
                    <InputLabel shrink>権限設定</InputLabel>
                    <Select {...field}>
                      {adminRoles.map((role) => (
                        <MenuItem value={role} key={role}>
                          {adminRoleToDisplayName[role]}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              />
            </div>
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
            {role === 'cast' && (
              <div className={classes.formControl}>
                <Controller
                  name="castId"
                  control={control}
                  defaultValue={''}
                  render={({ field }) => (
                    <>
                      <InputLabel shrink>キャストを選択</InputLabel>
                      <Select {...field} displayEmpty>
                        <MenuItem value="" disabled>
                          キャストを選択してください
                        </MenuItem>
                        {castList.map((cast) => (
                          <MenuItem value={cast.id} key={cast.id}>
                            {cast.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  )}
                />
              </div>
            )}
            <div className={classes.formControl}>
              <Controller
                name="publicDisplayName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormInput
                    field={field}
                    fieldError={errors?.publicDisplayName}
                    placeholder="表示名を入力"
                    label="表示名"
                    fullWidth={true}
                  />
                )}
              />
            </div>
            <div className={classes.formControl}>
              <InputLabel shrink style={{ marginBottom: '4px' }}>
                表示アイコン
              </InputLabel>
              <FormImageInput
                componentKey="image-input"
                previewWidth={40}
                previewHeight={40}
                previewObjectFit="cover"
                isPreviewCircle={true}
                initialImageUrl={undefined}
                uploadButton={
                  <Button
                    variant="outlined"
                    color="default"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    表示アイコン
                  </Button>
                }
                onDropFile={(file) => {
                  setValue('publicAvatar', file);
                }}
                showUploadButton={true}
              />
            </div>
            {errorMessage && (
              <p className={classes.errorMessage}>{errorMessage}</p>
            )}
            <FormActions
              submitText="管理者を追加"
              isDisabled={isCreating || publicAvatar === undefined}
              isLoading={isCreating}
            />
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AdminUserCreateModal;
