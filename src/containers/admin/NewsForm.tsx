import { memo, useEffect, useState } from 'react';
import { Controller, useFormContext, useFormState } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { ContentState, EditorState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { EditorProps } from 'react-draft-wysiwyg';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { storage } from '@/libs/firebase';
import { blockRenderer } from '@/libs/utils/draft';
import { getISOString } from '@/libs/utils/dateFormat';
import { FormData } from '@/config/form/news';
import FormInput from '@/components/form/Input';
import FormImageInput from '@/components/form/ImageInput';
import { News, NewsStatus } from '@/libs/models/news';
import { colors, editorColors } from '@/config/ui';
import { usePageRemovingAlert } from '@/hooks/pageRemovingAlert';

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false },
);

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2, 4),
  },
  formControl: {
    padding: theme.spacing(1.5, 0),
  },
  editorContainer: {
    color: colors.brown,
  },
}));

type Props = {
  newsId: string;
  news?: News | null;
};

const AdminNewsForm = memo<Props>(({ newsId, news }) => {
  const classes = useStyles();
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<FormData>();
  const { isDirty } = useFormState();
  const [isEditorDirty, setIsEditorDirty] = useState(false);
  usePageRemovingAlert({ showAlert: isDirty || isEditorDirty });

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);
    setValue('contentState', editorState);
    !isEditorDirty && setIsEditorDirty(true);
  };

  useEffect(() => {
    if (news) {
      setValue('title', news.title);
      setValue('description', news.description);
      setValue('status', news.status);
      setValue('publishedAt', getISOString(news.publishedAt));
      const { contentBlocks, entityMap } = htmlToDraft(news.content);
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap,
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
      setValue('contentState', editorState);
    }
  }, [news, setValue]);

  const onUploadFile = async (file: File) => {
    try {
      const uploadTaskSnap = await storage
        .ref()
        .child(`news/${newsId}/images/${new Date().getTime()}`)
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
      <Grid item xs={6}>
        <div className={classes.formControl}>
          <Controller
            name="publishedAt"
            control={control}
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.publishedAt}
                type="datetime-local"
                label="公開日時"
              />
            )}
          />
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className={classes.formControl}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel shrink>公開設定</InputLabel>
                <Select {...field}>
                  <MenuItem value={NewsStatus.Published}>公開</MenuItem>
                  <MenuItem value={NewsStatus.Limited}>限定公開</MenuItem>
                  <MenuItem value={NewsStatus.Draft}>下書き</MenuItem>
                </Select>
              </>
            )}
          />
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className={classes.formControl}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.title}
                placeholder="タイトルを入力"
                label="タイトル"
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className={classes.formControl}>
          <InputLabel shrink style={{ marginBottom: '4px' }}>
            トップ画像
          </InputLabel>
          <FormImageInput
            componentKey="image-input"
            previewWidth={250}
            previewHeight={150}
            previewObjectFit="contain"
            initialImageUrl={news?.imageUrl ?? ''}
            uploadButton={
              <Button
                variant="outlined"
                color="default"
                component="span"
                startIcon={<CloudUploadIcon />}
              >
                トップ画像をアップロード
              </Button>
            }
            onDropFile={(file) => setValue('image', file)}
          />
        </div>
      </Grid>
      <Grid item xs={6}>
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
                rowsMax={5}
                fullWidth={true}
                rows={3}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </div>
      </Grid>
      <Grid item xs={12}>
        <Editor
          customBlockRenderFunc={blockRenderer}
          editorState={editorState}
          editorClassName={classes.editorContainer}
          onEditorStateChange={onEditorStateChange}
          wrapperStyle={{
            padding: '8px 0',
          }}
          toolbarStyle={{
            padding: '8px 0',
            border: 'none',
          }}
          editorStyle={{
            minHeight: '30vh',
            maxHeight: 'calc(100vh - 160px)',
            padding: '0px 8px',
          }}
          placeholder="内容を入力"
          localization={{
            locale: 'ja',
          }}
          toolbar={{
            options: [
              'inline',
              'blockType',
              'list',
              'link',
              'image',
              'emoji',
              'colorPicker',
            ],
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: false },
            image: {
              uploadCallback: onUploadFile,
              inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,',
              previewImage: true,
              defaultSize: {
                height: '400',
                width: 'auto',
              },
            },
            colorPicker: {
              colors: editorColors,
            },
          }}
        />
      </Grid>
    </Grid>
  );
});

export default AdminNewsForm;
