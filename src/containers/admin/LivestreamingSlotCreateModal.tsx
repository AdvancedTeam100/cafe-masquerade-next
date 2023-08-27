import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Divider from '@material-ui/core/Divider';
import Modal from '@/components/common/Modal';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { FormData, validationSchema } from '@/config/form/livestreamingSlot';
import { ThunkDispatch } from '@/store';
import {
  LivestreamingSlotParams,
  livestreamingSlotListOperations,
  livestreamingSlotListSelectors,
} from '@/store/admin/livestreamingSlotList';
import FormInput from '@/components/form/Input';
import FormActions from '@/components/form/Actions';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '600px',
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
  nestedForm: {
    margin: theme.spacing(0, 1, 1),
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

const AdminLivestreamingSlotCreateModal: React.FC<Props> = ({
  isOpened,
  handleClose,
}) => {
  const classes = useStyles();
  const { isCreating } = useSelector(livestreamingSlotListSelectors.state);
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
    defaultValues: {
      name: '',
      encoder: {
        username: '',
        password: '',
        streamkey: '',
        ingestUrl: {
          primary: '',
          backup: '',
        },
      },
      playbackUrl: {
        hls: '',
      },
      sharedSecret: '',
    },
  });

  const getList = useCallback(() => {
    dispatch(livestreamingSlotListOperations.get());
  }, [dispatch]);

  const create = useCallback(
    (params: LivestreamingSlotParams) => {
      dispatch(
        livestreamingSlotListOperations.create(
          params,
          () => {
            enqueueSnackbar('スロットを登録しました', {
              variant: 'success',
            });
            handleClose();
            reset();
            getList();
          },
          (error: string) => {
            enqueueSnackbar('スロットの登録に失敗しました', {
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
          <h3 className={classes.title}>スロットを登録</h3>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider />
        <div className={classes.formContainer}>
          <form onSubmit={onSubmit}>
            <div className={classes.formControl}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <FormInput
                    field={field}
                    fieldError={errors?.name}
                    placeholder="octomaslv"
                    label="スロット名"
                    fullWidth={true}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </div>
            <InputLabel>エンコーダー情報</InputLabel>
            <div className={classes.nestedForm}>
              <div className={classes.formControl}>
                <Controller
                  name="encoder.username"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      fieldError={errors?.encoder?.username}
                      placeholder="october"
                      label="ユーザー名"
                      size="small"
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </div>
              <div className={classes.formControl}>
                <Controller
                  name="encoder.password"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      fieldError={errors?.encoder?.password}
                      placeholder="******"
                      label="パスワード"
                      size="small"
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </div>
              <div className={classes.formControl}>
                <Controller
                  name="encoder.streamkey"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      fieldError={errors?.encoder?.streamkey}
                      placeholder="******"
                      label="ストリームキー"
                      size="small"
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </div>
              <div className={classes.formControl}>
                <Controller
                  name="encoder.ingestUrl.primary"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      fieldError={errors?.encoder?.ingestUrl?.primary}
                      placeholder="rtmp://***.octomaslv.pri.lldns.net/****"
                      label="インジェストURL(primary)"
                      size="small"
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </div>
              <div className={classes.formControl}>
                <Controller
                  name="encoder.ingestUrl.backup"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      fieldError={errors?.encoder?.ingestUrl?.backup}
                      placeholder="rtmp://***.octomaslv.back.lldns.net/****"
                      label="インジェストURL(backup)"
                      size="small"
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <InputLabel>配信情報</InputLabel>
            <div className={classes.nestedForm}>
              <div className={classes.formControl}>
                <Controller
                  name="playbackUrl.hls"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      fieldError={errors?.playbackUrl?.hls}
                      placeholder="http://***.mmdlive.lldns.net/octomaslv/********/manifest.m3u8"
                      label="HLS Playback URL"
                      size="small"
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </div>
              <div className={classes.formControl}>
                <Controller
                  name="sharedSecret"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      fieldError={errors?.sharedSecret}
                      placeholder="*******"
                      label="Shared Secret"
                      size="small"
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </div>
            </div>
            {errorMessage && (
              <p className={classes.errorMessage}>{errorMessage}</p>
            )}
            <FormActions
              submitText="スロットを登録"
              isDisabled={isCreating}
              isLoading={isCreating}
            />
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AdminLivestreamingSlotCreateModal;
