import { memo, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { EditorState } from 'draft-js';
import { blockRenderer } from '@/libs/utils/draft';
import { EditorProps } from 'react-draft-wysiwyg';
import { makeStyles } from '@material-ui/core/styles';
import { FormData } from '@/config/form/aboutContent';
import { colors, editorColors } from '@/config/ui';

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false },
);

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '8px',
  },
  editorContainer: {
    color: colors.brown,
  },
}));

type Props = {
  name: `contents.${number}.contentState`;
  onUploadFile: (file: File) => void;
  setEditorIsDirty: () => void;
};

const AdminAboutContentForm = memo<Props>(
  ({ name, onUploadFile, setEditorIsDirty }) => {
    const classes = useStyles();
    const { control, setValue } = useFormContext<FormData>();

    const editorState: EditorState = useWatch({ control, name });
    const [isDirty, setIsDirty] = useState(false);

    const onEditorStateChange = (editorState: EditorState) => {
      setValue(name, editorState as never);
      !isDirty && setIsDirty(true);
    };

    useEffect(() => {
      if (!isDirty) return;
      setEditorIsDirty();
    }, [isDirty, setEditorIsDirty]);

    return (
      <div className={classes.container}>
        <Editor
          customBlockRenderFunc={blockRenderer}
          editorState={editorState}
          editorClassName={classes.editorContainer}
          onEditorStateChange={onEditorStateChange}
          wrapperStyle={{
            padding: '8px',
          }}
          toolbarStyle={{
            padding: '8px 0',
            border: 'none',
          }}
          editorStyle={{
            minHeight: '300px',
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
      </div>
    );
  },
);

export default AdminAboutContentForm;
