import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { getISOString } from '@/libs/utils/dateFormat';
import {
  Video,
  VideoRequiredRole,
  VideoType,
  VideoUploadStatus,
  videoStatusToDisplayName,
  videoStatuses,
} from '@/libs/models/video';
import { castListSelectors } from '@/store/admin/castList';
import { storage } from '@/libs/firebase';
import { FormData } from '@/config/form/video';
import FormInput from '@/components/form/Input';
import FormImageInput from '@/components/form/ImageInput';
import VideoConfigDynamicForm, {
  DynamicValues,
} from '@/components/admin/VodeoConfigDynamicForm';
import { usePageRemovingAlert } from '@/hooks/pageRemovingAlert';
import VideoUploader from './VideoUploader';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2, 4),
  },
  formControl: {
    padding: theme.spacing(1.5, 3, 1.5, 0),
  },
  nestedFormControl: {
    padding: theme.spacing(1, 2),
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  flexStart: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  inlineInput: {
    width: '70px',
    margin: theme.spacing(0, 3, 1, 0),
    textAlign: 'center',
  },
  errorMessage: {
    color: theme.palette.error.main,
    margin: theme.spacing(1, 0),
  },
}));

type Props = {
  videoId: string;
  uploadStatus?: VideoUploadStatus;
  initialDynamicFormValue?: {
    type: VideoType | undefined | null;
    requiredRole: VideoRequiredRole | undefined | null;
    expiredAt: Video['expiredAt'];
  };
  initialSrcUrl?: string;
};

const AdminVideoForm: React.FC<Props> = ({
  videoId,
  uploadStatus,
  initialDynamicFormValue = {
    type: undefined,
    requiredRole: undefined,
    expiredAt: {},
  },
  initialSrcUrl,
}) => {
  const classes = useStyles();
  const {
    getValues,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<FormData>();
  const { isDirty } = useFormState();
  const thumbnailUrl = useWatch({ control, name: 'thumbnailUrl' });
  const [hasStartedUploading, setHasStartedUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  usePageRemovingAlert({
    showAlert: isDirty || hasStartedUploading,
  });
  const { castList } = useSelector(castListSelectors.state);

  const handleChangeDynamicValue = (changedValues: DynamicValues) => {
    if (changedValues.type) setValue('type', changedValues.type);
    if (changedValues.requiredRole)
      setValue('requiredRole', changedValues.requiredRole);
    setValue('expiredAt', changedValues.expiredAt);
  };

  const handleUploadThumbnail = async (file: File) => {
    try {
      const storageRef = storage.ref();
      const uploadTaskSnap = await storageRef
        .child(`video/${videoId}/thumbnails/${new Date().getTime()}`)
        .put(file);
      const thumbnailUrl: string = await uploadTaskSnap.ref.getDownloadURL();
      setValue('thumbnailUrl', thumbnailUrl);
    } catch (e) {
      enqueueSnackbar(
        'サムネイルのアップロードに失敗しました。再度試してください。',
        {
          variant: 'error',
        },
      );
    }
  };

  return (
    <Grid
      container
      className={classes.container}
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item sm={8} xs={12}>
        <div className={classes.formControl}>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.title}
                placeholder="動画のタイトルを入力"
                label="タイトル"
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            )}
          />
        </div>
        <div className={classes.formControl}>
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.description}
                placeholder="動画の説明を入力"
                label="説明"
                fullWidth
                multiline={true}
                rows={3}
                rowsMax={10}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            )}
          />
        </div>
        <div className={classes.formControl}>
          <InputLabel shrink style={{ marginBottom: '4px' }}>
            サムネイル
          </InputLabel>
          <FormImageInput
            componentKey="thumbnail-input"
            initialImageUrl={thumbnailUrl}
            showUploadButton
            uploadButton={
              <Button
                variant="outlined"
                color="default"
                component="span"
                startIcon={<CloudUploadIcon />}
                size="large"
              >
                サムネイルをアップロード
              </Button>
            }
            previewWidth={160}
            previewHeight={90}
            previewBackgroundColor="#000"
            onDropFile={handleUploadThumbnail}
          />
          {errors?.thumbnailUrl && (
            <p className={classes.errorMessage}>
              {errors?.thumbnailUrl.message}
            </p>
          )}
        </div>
        <VideoConfigDynamicForm
          publishedAt={getValues('publishedAt')}
          initialValues={initialDynamicFormValue}
          onChangeValue={handleChangeDynamicValue}
          errors={{
            type: errors?.type?.message,
            requiredRole: errors?.requiredRole?.message,
          }}
        />
      </Grid>
      <Grid item sm={4} xs={12}>
        <div className={classes.formControl}>
          <VideoUploader
            videoId={videoId}
            thumbnailUrl={thumbnailUrl}
            onFinishUpload={(fileName) => setUploadedFileName(fileName)}
            onStartUpload={() => {
              setUploadedFileName('');
              setHasStartedUploading(true);
            }}
            uploadStatus={uploadStatus}
            initialSrcUrl={initialSrcUrl}
          />
          {uploadedFileName && (
            <div style={{ marginTop: '8px' }}>
              <InputLabel shrink>ファイル名:</InputLabel>
              <p style={{ margin: 0 }}>{uploadedFileName}</p>
            </div>
          )}
        </div>
        <div className={classes.formControl}>
          <Controller
            name="castId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <>
                <InputLabel shrink>キャスト</InputLabel>
                <Select
                  {...field}
                  displayEmpty
                  style={{ minWidth: '120px' }}
                  variant="outlined"
                >
                  <MenuItem value="" disabled>
                    キャストを選択してください
                  </MenuItem>
                  <MenuItem value={''}>選択キャストなし</MenuItem>
                  {castList.map((cast) => (
                    <MenuItem value={cast.id} key={`castId-input-${cast.id}`}>
                      {cast.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors?.status && (
                  <p className={classes.errorMessage}>
                    {errors?.status.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
        <div className={classes.formControl}>
          <Controller
            name="status"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <>
                <InputLabel shrink>公開設定</InputLabel>
                <Select
                  {...field}
                  displayEmpty
                  style={{ minWidth: '120px' }}
                  variant="outlined"
                >
                  <MenuItem value="" disabled>
                    公開設定を選択してください
                  </MenuItem>
                  {videoStatuses.map((status) => (
                    <MenuItem value={status} key={`status-input-${status}`}>
                      {videoStatusToDisplayName[status]}
                    </MenuItem>
                  ))}
                </Select>
                {errors?.status && (
                  <p className={classes.errorMessage}>
                    {errors?.status.message}
                  </p>
                )}
              </>
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
                label="公開日時"
                variant="outlined"
              />
            )}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default AdminVideoForm;
