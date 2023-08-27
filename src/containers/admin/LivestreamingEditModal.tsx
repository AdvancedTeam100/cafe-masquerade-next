import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Modal from '@/components/common/Modal';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { FormData, validationSchema } from '@/config/form/livestreaming';
import { getISOString } from '@/libs/utils/dateFormat';
import { createMd5Hash } from '@/libs/utils/encryption';
import { Livestreaming } from '@/libs/models/livestreaming';
import { userRoleToDisplayName, userRoles } from '@/libs/models/user';
import { LivestreamingPassword } from '@/libs/models/livestreamingCredential';
import { ThunkDispatch } from '@/store';
import {
  LivestreamingUpdateParams,
  livestreamingOperations,
  livestreamingSelectors,
} from '@/store/admin/livestreaming';
import { livestreamingListOperations } from '@/store/admin/livestreamingList';
import FormInput from '@/components/form/Input';
import FormImageInput from '@/components/form/ImageInput';
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
  flex: {
    display: 'flex',
    alignItems: 'center',
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
  livestreaming: Livestreaming;
  livestreamingPassword: LivestreamingPassword;
  isOpened: boolean;
  handleClose: () => void;
};

const AdminLivestreamingEditModal: React.FC<Props> = ({
  livestreaming,
  livestreamingPassword,
  isOpened,
  handleClose,
}) => {
  const classes = useStyles();
  const { isUpdating } = useSelector(livestreamingSelectors.state);
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

  const get = useCallback(() => {
    dispatch(livestreamingOperations.get(livestreaming.id));
  }, [dispatch, livestreaming]);

  const getList = useCallback(() => {
    dispatch(livestreamingListOperations.get());
  }, [dispatch]);

  const update = useCallback(
    (params: LivestreamingUpdateParams) => {
      dispatch(
        livestreamingOperations.update(
          livestreaming.id,
          params,
          () => {
            enqueueSnackbar('ライブ配信枠を更新しました', {
              variant: 'success',
            });
            handleClose();
            reset();
            get();
            getList();
          },
          (error: string) => {
            enqueueSnackbar('ライブ配信枠の更新に失敗しました', {
              variant: 'error',
            });
            setErrorMessage(error);
          },
        ),
      );
    },
    [
      dispatch,
      enqueueSnackbar,
      reset,
      handleClose,
      getList,
      get,
      livestreaming.id,
    ],
  );

  const onSubmit = handleSubmit((data) => {
    setErrorMessage('');
    const password = createMd5Hash(data.rawPassword);
    const params: LivestreamingUpdateParams = {
      ...data,
      password,
      thumbnailUrl: livestreaming.thumbnailUrl,
    };
    update(params);
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
          <h3 className={classes.title}>ライブ配信枠を編集</h3>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider />
        <div className={classes.formContainer}>
          <form onSubmit={onSubmit}>
            <div className={classes.formControl}>
              <Controller
                name="title"
                control={control}
                defaultValue={livestreaming.title}
                render={({ field }) => (
                  <FormInput
                    field={field}
                    fieldError={errors?.title}
                    placeholder="タイトルを入力"
                    label="タイトル"
                    fullWidth={true}
                  />
                )}
              />
            </div>
            <div className={classes.formControl}>
              <Controller
                name="description"
                control={control}
                defaultValue={livestreaming.description}
                render={({ field }) => (
                  <FormInput
                    field={field}
                    fieldError={errors?.description}
                    placeholder="説明を入力"
                    label="説明"
                    multiline={true}
                    rowsMax={10}
                    fullWidth={true}
                  />
                )}
              />
            </div>
            <div className={classes.formControl}>
              <Controller
                name="publishedAt"
                control={control}
                defaultValue={getISOString(livestreaming.publishedAt)}
                render={({ field }) => (
                  <FormInput
                    field={field}
                    fieldError={errors?.publishedAt}
                    type="datetime-local"
                    label="配信日時"
                  />
                )}
              />
            </div>
            <div className={classes.formControl}>
              <FormImageInput
                componentKey="thumbnail-input"
                uploadButton={
                  <Button
                    variant="outlined"
                    color="default"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    サムネイルをアップロード
                  </Button>
                }
                previewWidth={160}
                previewHeight={90}
                onDropFile={(file) => setValue('thumbnail', file)}
                initialImageUrl={livestreaming.thumbnailUrl}
              />
            </div>
            <div className={classes.formControl}>
              <Controller
                name="requiredRole"
                control={control}
                defaultValue={livestreaming.requiredRole}
                render={({ field }) => (
                  <>
                    <InputLabel shrink>閲覧可能範囲</InputLabel>
                    <Select {...field} displayEmpty>
                      <MenuItem value="" disabled>
                        会員ランクを選択してください
                      </MenuItem>
                      {userRoles.map((role) => (
                        <MenuItem value={role} key={role}>
                          <span className={classes.flex}>
                            <RoleIcon role={role} />
                            <span style={{ marginLeft: '4px' }}>
                              {userRoleToDisplayName[role]}以上
                            </span>
                          </span>
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              />
            </div>
            <div className={classes.formControl}>
              <Controller
                name="rawPassword"
                control={control}
                defaultValue={livestreamingPassword.rawPassword}
                render={({ field }) => (
                  <FormInput
                    field={field}
                    fieldError={errors?.rawPassword}
                    placeholder="閲覧用パスワードを入力"
                    label="閲覧用パスワード"
                    fullWidth={true}
                  />
                )}
              />
            </div>
            {errorMessage && (
              <p className={classes.errorMessage}>{errorMessage}</p>
            )}
            <FormActions
              submitText="ライブ配信枠を更新"
              isDisabled={isUpdating}
              isLoading={isUpdating}
            />
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AdminLivestreamingEditModal;
