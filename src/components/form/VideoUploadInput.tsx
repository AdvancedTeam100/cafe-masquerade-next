import { ChangeEvent } from 'react';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  onDropFile: (file: File) => void;
};

const useStyles = makeStyles(() => ({
  container: {},
  preview: {
    marginRight: '8px',
    backgroundColor: '#000',
  },
}));

const VideoUploadInput = ({ onDropFile }: Props) => {
  const classes = useStyles();

  const onChangeImageInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onDropFile(files[0]);
    }
  };

  return (
    <div className={classes.container}>
      <input
        style={{ display: 'none' }}
        accept="video/mp4"
        id="video-upload-input"
        type="file"
        onChange={onChangeImageInput}
      />
      <div className={classes.preview} />
      <label htmlFor="video-upload-input">
        <Button
          variant="outlined"
          color="primary"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          動画をアップロード
        </Button>
      </label>
    </div>
  );
};
export default VideoUploadInput;
