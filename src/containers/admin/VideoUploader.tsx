import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@/store';
import { videoOperations, videoSelectors } from '@/store/admin/video';
import { storage } from '@/libs/firebase';
import VideoUploadInput from '@/components/form/VideoUploadInput';
import VideoPreview from '@/components/admin/VideoPreview';
import {
  videoCredentialDocument,
  videoInfoConverter,
} from '@/libs/firebase/firestore/videoCredential';
import { videoConverter, videoDocument } from '@/libs/firebase/firestore/video';
import { VideoUploadStatus } from '@/libs/models/video';
import { theme } from '@/config/ui';

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
  },
  actionArea: {
    margin: theme.spacing(2, 0),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

type Props = {
  videoId: string;
  thumbnailUrl: string | undefined;
  onStartUpload: () => void;
  onFinishUpload: (fileName: string) => void;
  uploadStatus?: VideoUploadStatus;
  initialSrcUrl?: string;
};

const VideoUploader: React.FC<Props> = ({
  videoId,
  thumbnailUrl,
  onStartUpload,
  onFinishUpload,
  uploadStatus: initialUploadStatus,
  initialSrcUrl,
}) => {
  const classes = useStyles();

  const { isEnableToPlay } = useSelector(videoSelectors.state);
  const dispatch = useDispatch<ThunkDispatch>();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [shouldListenSrcUrl, setShouldListenSrcUrl] = useState(
    initialUploadStatus !== undefined,
  );
  const [uploadStatus, setUploadStatus] = useState(initialUploadStatus);
  const [srcUrl, setSrcUrl] = useState(initialSrcUrl);

  const checkEnableToPlay = useCallback(
    (videoId: string) => {
      dispatch(videoOperations.checkEnableToPlay(videoId));
    },
    [dispatch],
  );

  useEffect(() => {
    checkEnableToPlay(videoId);
    const unsub = videoCredentialDocument(videoId, 'info')
      .withConverter(videoInfoConverter)
      .onSnapshot((doc) => {
        const videoInfo = doc.data();
        if (videoInfo) {
          setSrcUrl(videoInfo.url);
          if (uploadedFileName) {
            onFinishUpload(uploadedFileName);
          }
        }
      });
    return () => {
      unsub();
    };
  }, [
    uploadStatus,
    shouldListenSrcUrl,
    checkEnableToPlay,
    videoId,
    onFinishUpload,
    uploadedFileName,
  ]);

  useEffect(() => {
    const unsub = videoDocument(videoId)
      .withConverter(videoConverter)
      .onSnapshot((doc) => {
        const video = doc.data();
        if (!video) return;
        if (video.uploadStatus) {
          // Cloud storageにアップロードが完了していて、トランスコード中/完了の時
          setUploadStatus(video.uploadStatus);
          setUploadProgress(0);
          setSrcUrl('');
          setShouldListenSrcUrl(true);
        }
      });
    return () => {
      unsub();
    };
  }, [shouldListenSrcUrl, videoId, onFinishUpload, uploadedFileName]);

  const handleUploadVieo = (file: File) => {
    (async () => {
      setUploadStatus(undefined);
      setShouldListenSrcUrl(false);
      setUploadedFileName(file.name);
      onStartUpload();

      const fileName = file.name
        .replace(/[\x20\u3000]/g, '_')
        .replace(/\//g, '');
      const uploadTask = storage
        .ref()
        .child(`video/${videoId}/original/${fileName}`)
        .put(file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.floor(progress));
        },
        (error) => {
          console.log(error);
        },
        () => {
          setUploadProgress(100);
        },
      );
    })();
  };

  return (
    <>
      <div className={classes.container}>
        <VideoPreview
          srcUrl={srcUrl}
          thumbnailUrl={thumbnailUrl}
          uploadProgress={uploadProgress}
          isTranscoding={
            uploadStatus !== 'Transcoded' &&
            (uploadProgress === 100 || uploadStatus === 'RequestedTranscode')
          }
          isEnableToPlay={isEnableToPlay}
        />
        <div className={classes.actionArea}>
          <VideoUploadInput onDropFile={handleUploadVieo} />
        </div>
      </div>
    </>
  );
};

export default VideoUploader;
