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
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { FormData } from '@/config/form/homeContent';
import FormInput from '@/components/form/Input';
import { HomeContent } from '@/libs/models/content';
import HomeContentDraggableImagesForm from '@/containers/admin/HomeContentDraggableImagesForm';
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
  removeContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'relative',
    top: '32px',
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  nestedInput: {
    marginBottom: theme.spacing(1),
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  flexStart: {
    display: 'flex',
    alignItems: 'flex-start',
  },
}));

type Props = {
  homeContent?: HomeContent | null;
};

const AdminHomeContentForm = memo<Props>(({ homeContent }) => {
  const classes = useStyles();
  const {
    control,
    formState: { errors },
    setValue,
    reset,
  } = useFormContext<FormData>();
  const { isDirty } = useFormState();
  usePageRemovingAlert({ showAlert: isDirty });

  const {
    fields: sideLinkFields,
    append: appendSideLink,
    remove: removeSideLink,
  } = useFieldArray({
    control,
    name: 'sideLinks',
  });
  const {
    fields: topImageFields,
    append: appendTopImage,
    remove: removeTopImage,
  } = useFieldArray({
    control,
    name: 'topImages',
  });

  const topImages = useWatch({ control, name: 'topImages' });

  const [isDisabeledImageAdd, setIsDisabledImageAdd] = useState(false);

  useEffect(() => {
    const firstImage = topImages[0];
    if (firstImage) {
      setIsDisabledImageAdd('url' in firstImage && firstImage?.url === '');
    }
  }, [topImages]);

  useEffect(() => {
    if (homeContent) {
      reset({
        sideLinks: homeContent.sideLinks,
        topImages: homeContent.topImages,
      });
      // setValue('sideLinks', homeContent.sideLinks);
      homeContent.topImages.forEach((image, i) => {
        setValue(
          `topImages.${i}.href` as `topImages.${number}.href`,
          image.href as never,
        );
        setValue(
          `topImages.${i}.url` as `topImages.${number}.url`,
          image.url as never,
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeContent]);

  return (
    <Grid
      container
      className={classes.container}
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item sm={6} xs={12}>
        <div className={classes.formControl}>
          <InputLabel shrink style={{ marginBottom: '4px' }}>
            サイドバーリンク
            {sideLinkFields.length < 10 && (
              <Tooltip title="追加">
                <IconButton
                  onClick={() => appendSideLink({ title: '', href: '' })}
                >
                  <AddIcon color="primary" />
                </IconButton>
              </Tooltip>
            )}
          </InputLabel>
          {sideLinkFields.map((sideLink, i) => (
            <div
              className={classes.nestedFormControl}
              style={{ marginTop: '-24px' }}
              key={sideLink.id}
            >
              {sideLinkFields.length > 1 && (
                <div className={classes.removeContainer}>
                  <Tooltip title="削除">
                    <IconButton onClick={() => removeSideLink(i)} size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
              <Controller
                name={`sideLinks.${i}.title` as `sideLinks.${number}.title`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    field={field}
                    fieldError={
                      errors?.sideLinks?.length
                        ? errors?.sideLinks[i]?.title
                        : undefined
                    }
                    label="タイトル"
                    placeholder={'タイトル'}
                    className={classes.nestedInput}
                  />
                )}
              />
              <Controller
                name={`sideLinks.${i}.href` as `sideLinks.${number}.href`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    field={field}
                    fieldError={
                      errors?.sideLinks?.length
                        ? errors?.sideLinks[i]?.href
                        : undefined
                    }
                    label="リンク"
                    placeholder={'リンク'}
                    fullWidth
                    className={classes.nestedInput}
                  />
                )}
              />
            </div>
          ))}
        </div>
      </Grid>
      <Grid container className={classes.formControl}>
        <InputLabel shrink style={{ marginBottom: '4px' }}>
          トップ画像
          {topImageFields.length < 10 && (
            <Tooltip title="追加">
              <span>
                <IconButton
                  onClick={() => appendTopImage({ url: '', href: '' })}
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
          <HomeContentDraggableImagesForm
            removeTopImage={removeTopImage}
            setValue={setValue}
            topImages={topImages}
            topImageFields={topImageFields}
          />
        </Grid>
      </Grid>
    </Grid>
  );
});

export default AdminHomeContentForm;
