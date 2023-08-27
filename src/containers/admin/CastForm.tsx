import { memo, useEffect, useState } from 'react';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { getDateStringHyphens } from '@/libs/utils/dateFormat';
import { FormData } from '@/config/form/cast';
import FormInput from '@/components/form/Input';
import FormImageInput from '@/components/form/ImageInput';
import { Cast, CastStatus } from '@/libs/models/cast';
import { CastImage } from '@/libs/models/castImage';
import { usePageRemovingAlert } from '@/hooks/pageRemovingAlert';

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
}));

type Props = {
  cast?: Cast | null;
  castImages?: CastImage[];
};

const AdminCastForm = memo<Props>(({ cast, castImages }) => {
  const classes = useStyles();
  const {
    control,
    formState: { errors },
    setValue,
    reset,
  } = useFormContext<FormData>();
  const { isDirty } = useFormState();
  usePageRemovingAlert({ showAlert: isDirty });

  const { append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'images',
  });
  const {
    fields: qaFields,
    append: appendQa,
    remove: removeQa,
  } = useFieldArray({
    control,
    name: 'qa',
  });

  const images = useWatch({ control, name: 'images' });

  const [isDisabeledImageAdd, setIsDisabledImageAdd] = useState(false);

  useEffect(() => {
    const firstImage = images[0];
    if (firstImage) {
      setIsDisabledImageAdd('id' in firstImage && firstImage?.id === '');
    }
  }, [images]);

  useEffect(() => {
    if (cast && castImages) {
      reset({
        id: cast.id,
        name: cast.name,
        description: cast.description,
        livestreamingDescription: cast.livestreamingDescription,
        selfIntroduction: cast.selfIntroduction,
        physicalInformation: cast.physicalInformation,
        status: cast.status,
        youtubeChannelId: cast.youtubeChannelId,
        youtubeChannelIdSecond: cast.youtubeChannelIdSecond,
        images: [],
        tags: cast.tags,
        qa: cast.qa,
        socialId: cast.socialId,
        joinedAt: getDateStringHyphens(cast.joinedAt),
        notificationDiscordUrl: cast.notificationDiscordUrl,
      });
      setValue('images', castImages);
    }
  }, [cast, castImages, setValue, reset]);

  return (
    <Grid
      container
      className={classes.container}
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item sm={6} xs={12}>
        <div className={classes.formControl}>
          <Controller
            name="id"
            control={control}
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.id}
                placeholder="idを入力（作成後編集不可）"
                label="id"
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={cast !== undefined}
              />
            )}
          />
        </div>
      </Grid>
      <Grid item sm={4} xs={6}>
        <div className={classes.formControl}>
          <Controller
            name="joinedAt"
            control={control}
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.joinedAt}
                type="date"
                label="入店日"
              />
            )}
          />
        </div>
      </Grid>
      <Grid item sm={2} xs={6}>
        <div className={classes.formControl}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel shrink>公開設定</InputLabel>
                <Select {...field}>
                  <MenuItem value={CastStatus.Published}>公開</MenuItem>
                  <MenuItem value={CastStatus.Draft}>下書き</MenuItem>
                </Select>
              </>
            )}
          />
        </div>
      </Grid>
      <Grid item sm={5} xs={12}>
        <div className={classes.formControl}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.name}
                placeholder="名前を入力"
                label="名前"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </div>
      </Grid>
      <Grid item sm={7} xs={12} />
      <Grid item sm={12}>
        <div className={classes.formControl}>
          <InputLabel shrink style={{ marginBottom: '4px' }}>
            トップ画像
          </InputLabel>
          <FormImageInput
            componentKey="image-input"
            previewWidth={150}
            previewHeight={200}
            previewObjectFit="cover"
            initialImageUrl={cast?.imageUrl ?? ''}
            uploadButton={
              <Button
                variant="outlined"
                color="default"
                component="span"
                startIcon={<CloudUploadIcon />}
              >
                トップ画像
              </Button>
            }
            onDropFile={(file) => {
              setValue('image', file);
              setValue('images', images);
            }}
            showUploadButton={true}
          />
        </div>
      </Grid>
      <Grid container className={classes.formControl}>
        <InputLabel shrink style={{ marginBottom: '4px' }}>
          プロフィール画像
          {images.length < 10 && (
            <Tooltip title="追加">
              <span>
                <IconButton
                  onClick={() => appendImage({ id: '', imageUrl: '' })}
                  disabled={isDisabeledImageAdd}
                >
                  <AddIcon
                    color={isDisabeledImageAdd ? 'disabled' : 'primary'}
                  />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </InputLabel>
        <Grid container spacing={2}>
          {images.map((item, index) => (
            <Grid
              item
              xl={2}
              lg={3}
              md={4}
              xs={6}
              key={`images-input-${index}`}
            >
              <div className={classes.flexStart}>
                <FormImageInput
                  componentKey={`images-input-${index}`}
                  previewWidth={150}
                  previewHeight={200}
                  previewObjectFit="cover"
                  initialImageUrl={'imageUrl' in item ? item.imageUrl : ''}
                  initialFile={'size' in item ? item : null}
                  uploadButton={
                    <Button
                      variant="outlined"
                      color="default"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      style={{ marginTop: '8px' }}
                    >
                      画像{index + 1}
                    </Button>
                  }
                  onDropFile={(file) => {
                    const newImages = images;
                    newImages[index] = file;
                    setValue('images', newImages);
                  }}
                />
                {images.length > 1 && (
                  <Tooltip title="削除">
                    <IconButton onClick={() => removeImage(index)} size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item sm={6} xs={12}>
        <div className={classes.formControl}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.description}
                placeholder="説明を入力"
                label="説明"
                multiline={true}
                rows={3}
                rowsMax={10}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </div>
      </Grid>
      <Grid item sm={6} xs={12}>
        <div className={classes.formControl}>
          <Controller
            name="selfIntroduction"
            control={control}
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.selfIntroduction}
                placeholder="キャストコメントを入力"
                label="キャストコメント(省略可)"
                multiline={true}
                rows={3}
                rowsMax={10}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </div>
      </Grid>
      <Grid item sm={6} xs={12}>
        <div className={classes.formControl}>
          <Controller
            name="livestreamingDescription"
            control={control}
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.livestreamingDescription}
                placeholder="配信の説明欄にデフォルトで記載する内容"
                label="配信の説明欄"
                multiline={true}
                rows={3}
                rowsMax={10}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </div>
      </Grid>
      <Grid item sm={6} xs={12}>
        <div className={classes.formControl}>
          <InputLabel shrink style={{ marginBottom: '4px' }}>
            身体情報
          </InputLabel>
          <div className={classes.nestedFormControl}>
            <div className={classes.flex}>
              <Controller
                name="physicalInformation.height"
                control={control}
                render={({ field }) => (
                  <FormInput
                    className={classes.inlineInput}
                    field={field}
                    fieldError={errors?.physicalInformation?.height}
                    label="身長(cm)"
                    InputLabelProps={{ style: { width: '100px' } }}
                    type="number"
                    inputProps={{
                      min: 0,
                      max: 250,
                      style: { textAlign: 'center' },
                    }}
                  />
                )}
              />
              <Controller
                name="physicalInformation.weight"
                control={control}
                render={({ field }) => (
                  <FormInput
                    className={classes.inlineInput}
                    field={field}
                    fieldError={errors?.physicalInformation?.weight}
                    label="体重(kg)"
                    InputLabelProps={{ style: { width: '100px' } }}
                    type="number"
                    inputProps={{
                      min: 0,
                      max: 250,
                      style: { textAlign: 'center' },
                    }}
                  />
                )}
              />
              <Controller
                name="physicalInformation.cupSize"
                control={control}
                render={({ field }) => (
                  <FormInput
                    className={classes.inlineInput}
                    field={field}
                    fieldError={errors?.physicalInformation?.cupSize}
                    label="カップ(A-Z)"
                    type="string"
                    inputProps={{
                      style: { textAlign: 'center' },
                    }}
                    InputLabelProps={{
                      shrink: true,
                      style: { width: '100px' },
                    }}
                  />
                )}
              />
            </div>
            <div className={classes.flex}>
              <Controller
                name="physicalInformation.bustSize"
                control={control}
                render={({ field }) => (
                  <FormInput
                    className={classes.inlineInput}
                    field={field}
                    fieldError={errors?.physicalInformation?.bustSize}
                    label="バスト(cm)"
                    InputLabelProps={{ style: { width: '100px' } }}
                    type="number"
                    inputProps={{
                      min: 0,
                      max: 250,
                      style: { textAlign: 'center' },
                    }}
                  />
                )}
              />
              <Controller
                name="physicalInformation.waistSize"
                control={control}
                render={({ field }) => (
                  <FormInput
                    className={classes.inlineInput}
                    field={field}
                    fieldError={errors?.physicalInformation?.waistSize}
                    label="ウエスト(cm)"
                    InputLabelProps={{ style: { width: '100px' } }}
                    type="number"
                    inputProps={{
                      min: 0,
                      max: 250,
                      style: { textAlign: 'center' },
                    }}
                  />
                )}
              />
              <Controller
                name="physicalInformation.hipSize"
                control={control}
                render={({ field }) => (
                  <FormInput
                    className={classes.inlineInput}
                    field={field}
                    fieldError={errors?.physicalInformation?.hipSize}
                    label="ヒップ(cm)"
                    InputLabelProps={{ style: { width: '100px' } }}
                    type="number"
                    inputProps={{
                      min: 0,
                      max: 250,
                      style: { textAlign: 'center' },
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </Grid>
      <Grid item sm={6} xs={12}>
        <div className={classes.formControl}>
          <InputLabel shrink style={{ marginBottom: '4px' }}>
            ソーシャルID
          </InputLabel>
          <div className={classes.nestedFormControl}>
            <Controller
              name="socialId.twitter"
              control={control}
              render={({ field }) => (
                <FormInput
                  field={field}
                  fieldError={errors?.socialId?.twitter}
                  label="Twitterユーザーネーム"
                  placeholder={'@以降のユーザーネーム'}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              )}
            />
          </div>
          <div className={classes.nestedFormControl}>
            <Controller
              name="socialId.twitcasting"
              control={control}
              render={({ field }) => (
                <FormInput
                  field={field}
                  fieldError={errors?.socialId?.twitcasting}
                  label="ツイキャスユーザーネーム(省略可)"
                  placeholder={'@以降のユーザーネーム'}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              )}
            />
          </div>
          <div className={classes.nestedFormControl}>
            <Controller
              name="socialId.tiktok"
              control={control}
              render={({ field }) => (
                <FormInput
                  field={field}
                  fieldError={errors?.socialId?.tiktok}
                  label="TikTokユーザーネーム(省略可)"
                  placeholder={'@以降のユーザーネーム'}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              )}
            />
          </div>
          <div className={classes.nestedFormControl}>
            <Controller
              name="socialId.niconico"
              control={control}
              render={({ field }) => (
                <FormInput
                  field={field}
                  fieldError={errors?.socialId?.niconico}
                  label="ニコニコ動画のチャンネルID(省略可)"
                  placeholder={'"https://ch.nicovideo.jp/"以降のユーザーネーム'}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              )}
            />
          </div>
        </div>
        <div className={classes.nestedFormControl}>
          <Controller
            name="youtubeChannelId"
            control={control}
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.youtubeChannelId}
                label="YouTube Channel Id"
                placeholder={'YouTubeのチャンネルID'}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            )}
          />
        </div>
        <div className={classes.nestedFormControl}>
          <Controller
            name="youtubeChannelIdSecond"
            control={control}
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.youtubeChannelIdSecond}
                label="YouTube 2nd Channel Id (省略可)"
                placeholder={'YouTubeの2ndチャンネルID'}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            )}
          />
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className={classes.formControl}>
          <InputLabel shrink style={{ marginBottom: '4px' }}>
            女の子に質問
            {qaFields.length < 50 && (
              <Tooltip title="追加">
                <IconButton
                  onClick={() =>
                    appendQa({
                      question: '',
                      answer: '',
                    })
                  }
                >
                  <AddIcon color="primary" />
                </IconButton>
              </Tooltip>
            )}
          </InputLabel>
          {qaFields.map((field, i) => (
            <Grid container spacing={2} key={field.id}>
              <Grid item xs={5}>
                <Controller
                  name={`qa.${i}.question` as `qa.${number}.question`}
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      fieldError={
                        errors?.qa?.length ? errors?.qa[i]?.question : undefined
                      }
                      label="質問"
                      placeholder={'質問を入力'}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name={`qa.${i}.answer` as `qa.${number}.answer`}
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      field={field}
                      fieldError={
                        errors?.qa?.length ? errors?.qa[i]?.answer : undefined
                      }
                      label="回答"
                      placeholder={'回答を入力'}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={1}>
                <Tooltip title="削除">
                  <IconButton onClick={() => removeQa(i)} size="small">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          ))}
        </div>
      </Grid>
    </Grid>
  );
});

export default AdminCastForm;
