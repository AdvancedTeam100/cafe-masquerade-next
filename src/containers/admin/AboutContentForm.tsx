import { memo, useEffect, useState } from 'react';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { ContentState, EditorState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { storage } from '@/libs/firebase';
import { AboutContent } from '@/libs/models/content';
import { FormData } from '@/config/form/aboutContent';
import FormInput from '@/components/form/Input';
import AboutContentEditor from '@/components/admin/AboutContentEditor';
import { usePageRemovingAlert } from '@/hooks/pageRemovingAlert';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2, 4),
  },
  formControl: {
    padding: theme.spacing(1.5, 3, 1.5, 0),
  },
  removeContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  formItem: {
    marginBottom: theme.spacing(4),
  },
}));

type Props = {
  aboutContent?: AboutContent | null;
};

const AdminAboutContentForm = memo<Props>(({ aboutContent }) => {
  const classes = useStyles();
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const {
    control,
    formState: { errors },
    setValue,
    reset,
  } = useFormContext<FormData>();
  const { isDirty } = useFormState();
  const [isEditorDirty, setIsEditorDirty] = useState(false);
  usePageRemovingAlert({ showAlert: isDirty || isEditorDirty });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contents',
  });

  const contents = useWatch({ control, name: 'contents' });

  useEffect(() => {
    if (aboutContent) {
      reset({ contents: aboutContent.contents });
      setIsFormInitialized(true);
    }
  }, [aboutContent, reset]);

  useEffect(() => {
    if (isFormInitialized && aboutContent) {
      aboutContent.contents.forEach((content, i) => {
        const { contentBlocks, entityMap } = htmlToDraft(content.content);
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap,
        );
        const editorState = EditorState.createWithContent(contentState);
        setValue(
          `contents.${i}.contentState` as `contents.${number}.contentState`,
          editorState as never,
        );
      });
    }
  }, [isFormInitialized, aboutContent, setValue]);

  const onUploadFile = async (file: File) => {
    try {
      const uploadTaskSnap = await storage
        .ref()
        .child(`about/images/${new Date().getTime()}`)
        .put(file);
      const downloadUrl = await uploadTaskSnap.ref.getDownloadURL();
      return {
        data: {
          link: downloadUrl,
        },
      };
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Grid
      container
      className={classes.container}
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs={12}>
        <div className={classes.formControl}>
          <InputLabel shrink style={{ marginBottom: '4px' }}>
            内容
            {contents.length < 10 && (
              <Tooltip title="追加">
                <IconButton
                  onClick={() =>
                    append({
                      title: '',
                      subTitle: '',
                      contentState: EditorState.createEmpty(),
                    })
                  }
                >
                  <AddIcon color="primary" />
                </IconButton>
              </Tooltip>
            )}
          </InputLabel>
          {fields.map((field, i) => (
            <div key={field.id} className={classes.formItem}>
              {fields.length > 1 && (
                <div className={classes.removeContainer}>
                  <Tooltip title="削除">
                    <IconButton onClick={() => remove(i)} size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Controller
                    name={`contents.${i}.title` as `contents.${number}.title`}
                    control={control}
                    render={({ field }) => (
                      <FormInput
                        field={field}
                        fieldError={
                          errors?.contents?.length
                            ? errors?.contents[i]?.title
                            : undefined
                        }
                        label="タイトル"
                        placeholder={'タイトル'}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={
                      `contents.${i}.subTitle` as `contents.${number}.subTitle`
                    }
                    control={control}
                    render={({ field }) => (
                      <FormInput
                        field={field}
                        fieldError={
                          errors?.contents?.length
                            ? errors?.contents[i]?.subTitle
                            : undefined
                        }
                        label="サブタイトル"
                        placeholder={'サブタイトル'}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <AboutContentEditor
                    name={
                      `contents.${i}.contentState` as `contents.${number}.contentState`
                    }
                    onUploadFile={onUploadFile}
                    setEditorIsDirty={() => setIsEditorDirty(true)}
                  />
                </Grid>
              </Grid>
            </div>
          ))}
        </div>
      </Grid>
    </Grid>
  );
});

export default AdminAboutContentForm;
