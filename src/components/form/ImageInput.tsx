import { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import { Theme, makeStyles } from '@material-ui/core/styles';

type Props = {
  componentKey: string;
  uploadButton: ReactNode;
  previewWidth: number;
  previewHeight: number;
  onDropFile: (file: File) => void;
  previewObjectFit?: 'contain' | 'cover';
  initialImageUrl?: string;
  initialFile?: File | null;
  isPreviewCircle?: boolean;
  showUploadButton?: boolean;
  previewBackgroundColor?: string;
};

const useStyles = makeStyles<
  Theme,
  {
    isPreviewCircle: boolean;
    previewObjectFit: 'contain' | 'cover';
    previewBackgroundColor: string;
  }
>(() => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  previewImage: {
    objectFit: ({ previewObjectFit }) => previewObjectFit,
    marginRight: '8px',
    backgroundColor: ({ previewBackgroundColor }) => previewBackgroundColor,
    borderRadius: ({ isPreviewCircle }) => (isPreviewCircle ? '50%' : 'none'),
    cursor: 'pointer',
  },
}));

const FormImageInput = ({
  componentKey,
  uploadButton,
  previewWidth,
  previewHeight,
  onDropFile,
  previewObjectFit = 'contain',
  initialImageUrl = '',
  initialFile,
  isPreviewCircle = false,
  showUploadButton = false,
  previewBackgroundColor = 'inherit',
}: Props) => {
  const classes = useStyles({
    isPreviewCircle,
    previewObjectFit,
    previewBackgroundColor,
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState(initialImageUrl);
  const onChangeImageInput = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const files = e.target.files;
    if (files?.length && files[0]) {
      const file = files[0];
      reader.onloadend = () => {
        setImagePreviewUrl(String(reader.result));
      };
      reader.readAsDataURL(file);
      onDropFile(file);
    }
  };

  useEffect(() => {
    if (initialImageUrl !== imagePreviewUrl) {
      setImagePreviewUrl(initialImageUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialImageUrl]);

  useEffect(() => {
    if (initialFile !== undefined) {
      if (initialFile === null) {
        setImagePreviewUrl(initialImageUrl);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviewUrl(String(reader.result));
        };
        reader.readAsDataURL(initialFile);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFile]);

  return (
    <div className={classes.container}>
      <input
        style={{ display: 'none' }}
        accept="image/*"
        id={componentKey}
        type="file"
        onChange={onChangeImageInput}
      />
      <label htmlFor={componentKey} className={classes.container}>
        {imagePreviewUrl && (
          <img
            className={classes.previewImage}
            src={imagePreviewUrl}
            alt="thumbnail"
            width={previewWidth}
            height={previewHeight}
          />
        )}
        {(!imagePreviewUrl || showUploadButton) && uploadButton}
      </label>
    </div>
  );
};
export default FormImageInput;
