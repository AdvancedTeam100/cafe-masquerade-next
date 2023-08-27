import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import NoteAddOutlinedIcon from '@material-ui/icons/NoteAddOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import LaunchIcon from '@material-ui/icons/Launch';
import { FormData, validationSchema } from '@/config/form/video';
import { ThunkDispatch } from '@/store';
import {
  VideoParams,
  videoActions,
  videoOperations,
  videoSelectors,
} from '@/store/admin/video';
import { castListOperations } from '@/store/admin/castList';
import AdminTemplate from '@/containers/admin/Template';
import VideoForm from '@/containers/admin/VideoForm';
import { getISOString } from '@/libs/utils/dateFormat';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { colors } from '@/config/ui';
import { isEnablePublic } from '@/libs/models/video';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  header: {
    paddingBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '1.3rem',
  },
  gridContainer: {
    minHeight: 'calc(100vh - 64px)',
  },
  formContainer: {
    height: 'calc(100% - 16px)',
  },
  errorMessage: {
    color: theme.palette.error.main,
    margin: theme.spacing(0),
    padding: theme.spacing(3),
  },
  sideContainer: {
    padding: theme.spacing(2),
  },
  subTitle: {
    fontSize: '1.1rem',
  },
  dangerArea: {
    margin: theme.spacing(6, 1),
  },
  deleteButton: {
    backgroundColor: colors.dangerRed,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: colors.lightDangerRed,
    },
  },
}));

const AdminVideoPage = () => {
  const classes = useStyles();
  const { video, videoInfo, isUpdating, isFetching, isDeleting } = useSelector(
    videoSelectors.state,
  );
  const dispatch = useDispatch<ThunkDispatch>();
  const router = useRouter();
  const videoId = router.query.videoId as string;
  const { enqueueSnackbar } = useSnackbar();
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
  const methods = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      expiredAt: {},
    },
  });
  const { handleSubmit, setValue } = methods;

  const get = useCallback(
    (videoId) => {
      dispatch(videoOperations.get(videoId));
    },
    [dispatch],
  );

  const getCastList = useCallback(() => {
    dispatch(castListOperations.get());
  }, [dispatch]);

  const update = useCallback(
    (params: VideoParams) => {
      if (!videoId) return;
      dispatch(
        videoOperations.update(
          videoId,
          params,
          () => {
            enqueueSnackbar('動画を更新しました', {
              variant: 'success',
            });
            get(videoId);
          },
          (error: string) => {
            enqueueSnackbar('動画の更新に失敗しました', {
              variant: 'error',
            });
            setErrorMessage(error);
          },
        ),
      );
    },
    [dispatch, enqueueSnackbar, videoId, get],
  );

  const deleteVideo = useCallback(() => {
    dispatch(
      videoOperations.deleteVideo(
        videoId,
        () => {
          enqueueSnackbar('動画を削除しました', {
            variant: 'success',
          });
          router.push('/admin/video/list');
        },
        (error: string) => {
          enqueueSnackbar(`動画の削除に失敗しました: ${error}`, {
            variant: 'error',
          });
        },
      ),
    );
  }, [dispatch, enqueueSnackbar, videoId, router]);

  useEffect(() => {
    if (videoId) {
      dispatch(videoActions.setVideoId({ videoId }));
      get(videoId);
      getCastList();
    }
  }, [dispatch, videoId, get, getCastList]);

  useEffect(() => {
    if (video) {
      setValue('title', video.title);
      setValue('description', video.description);
      setValue('thumbnailUrl', video.thumbnailUrl);
      setValue('status', video.status);
      setValue('type', video.type);
      setValue('requiredRole', video.requiredRole);
      setValue('expiredAt', video.expiredAt);
      setValue('publishedAt', getISOString(video.publishedAt));
      setValue('castId', video.castId ?? '');
    }
  }, [video, setValue]);

  const onSubmit = handleSubmit((data) => {
    setErrorMessage('');
    update(data);
  });

  return (
    <AdminTemplate
      goBackOption={{
        href: '/admin/video/list',
        as: '/admin/video/list',
        label: '一覧に戻る',
      }}
      isLoading={isFetching || isUpdating}
    >
      <div className={classes.container}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} style={{ height: '100%' }}>
            <div className={classes.header}>
              <Typography variant="h2" className={classes.title}>
                動画の詳細
              </Typography>
              <div>
                {isEnablePublic(video) && (
                  <Button
                    variant="outlined"
                    color="default"
                    href={`/videos/${videoId}`}
                    target="_blank"
                    startIcon={<LaunchIcon />}
                    style={{ marginRight: '8px' }}
                  >
                    動画ページ
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  startIcon={
                    isUpdating ? (
                      <CircularProgress size={16} />
                    ) : (
                      <NoteAddOutlinedIcon />
                    )
                  }
                  disabled={isUpdating}
                >
                  保存する
                </Button>
              </div>
            </div>
            <Grid container className={classes.gridContainer} spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.formContainer}>
                  {errorMessage && (
                    <p className={classes.errorMessage}>{errorMessage}</p>
                  )}
                  {video && video.id === videoId && (
                    <VideoForm
                      videoId={videoId}
                      uploadStatus={video.uploadStatus}
                      initialDynamicFormValue={{
                        type: video.type,
                        requiredRole: video.requiredRole,
                        expiredAt: video.expiredAt,
                      }}
                      initialSrcUrl={videoInfo?.url}
                    />
                  )}
                </Paper>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
        <div className={classes.dangerArea}>
          <Button
            variant="contained"
            onClick={() => setIsDeleteModalOpened(true)}
            className={classes.deleteButton}
            disabled={isUpdating}
          >
            動画の削除
          </Button>
        </div>
      </div>
      <ConfirmModal
        isOpened={isDeleteModalOpened}
        title={'動画を削除'}
        content={`本当に「${video?.title}」を削除しますか？`}
        onConfirm={deleteVideo}
        onClose={() => setIsDeleteModalOpened(false)}
        confirmText={'削除する'}
        cancelText={'キャンセル'}
        isLoading={isDeleting}
        isDisabled={isDeleting}
      />
    </AdminTemplate>
  );
};

export default AdminVideoPage;
