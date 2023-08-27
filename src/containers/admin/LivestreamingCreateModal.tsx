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
import { userRoleToDisplayName, userRoles } from '@/libs/models/user';
import { ThunkDispatch } from '@/store';
import {
  LivestreamingCreateParams,
  livestreamingOperations,
  livestreamingSelectors,
} from '@/store/admin/livestreaming';
import { livestreamingListOperations } from '@/store/admin/livestreamingList';
import { authSelectors } from '@/store/auth';
import FormInput from '@/components/form/Input';
import FormImageInput from '@/components/form/ImageInput';
import FormActions from '@/components/form/Actions';
import RoleIcon from '@/components/common/RoleIcon';
import { useRouter } from 'next/router';
import { generateRandomString } from '@/libs/utils/password';
import { VideoStatus, VideoType } from '@/libs/models/video';

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
  isOpened: boolean;
  handleClose: () => void;
};

const AdminLivestreamingCreateModal: React.FC<Props> = ({
  isOpened,
  handleClose,
}) => {
  const classes = useStyles();
  const { isCreating } = useSelector(livestreamingSelectors.state);
  const { user } = useSelector(authSelectors.state);
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
    defaultValues: {
      videoConfig: {
        type: null,
        status: VideoStatus.Private,
        requiredRole: null,
      },
      shouldStartRecording: true,
    },
  });
  const router = useRouter();

  const getList = useCallback(() => {
    dispatch(livestreamingListOperations.get());
  }, [dispatch]);

  const create = useCallback(
    (params: LivestreamingCreateParams) => {
      dispatch(
        livestreamingOperations.create(
          params,
          (livestreamingId) => {
            enqueueSnackbar('ライブ配信枠を作成しました', {
              variant: 'success',
            });
            handleClose();
            reset();
            getList();
            router.push(`/admin/livestreaming/${livestreamingId}`);
          },
          (error: string) => {
            enqueueSnackbar('ライブ配信枠の作成に失敗しました', {
              variant: 'error',
            });
            setErrorMessage(error);
          },
        ),
      );
    },
    [dispatch, enqueueSnackbar, reset, handleClose, getList, router],
  );

  const onSubmit = handleSubmit((data) => {
    if (data.thumbnail === undefined) {
      setErrorMessage('サムネイルをアップロードしてください');
      return;
    }
    setErrorMessage('');
    const rawPassword = generateRandomString(10);
    const password = createMd5Hash(rawPassword);
    const params: LivestreamingCreateParams = {
      ...data,
      description: '',
      rawPassword,
      password,
      castId: user && 'castId' in user ? user.castId ?? null : null,
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
          <h3 className={classes.title}>新規ライブ配信枠</h3>
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
                defaultValue=""
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
                name="publishedAt"
                control={control}
                defaultValue={getISOString(new Date())}
                render={({ field }) => (
                  <FormInput
                    field={field}
                    fieldError={errors?.publishedAt}
                    type="datetime-local"
                    label="配信日時"
                    inputProps={{ min: getISOString(new Date()) }}
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
              />
            </div>
            <div className={classes.formControl}>
              <Controller
                name="requiredRole"
                control={control}
                defaultValue={'gold'}
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
            {errorMessage && (
              <p className={classes.errorMessage}>{errorMessage}</p>
            )}
            <FormActions
              submitText="新規ライブ配信枠を作成"
              isDisabled={isCreating}
              isLoading={isCreating}
            />
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AdminLivestreamingCreateModal;
