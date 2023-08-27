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
import { FormData, validationSchema } from '@/config/form/video';
import { videoCollection } from '@/libs/firebase/firestore/video';
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

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    height: 'calc(100vh - 64px)',
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
    height: '100%',
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
}));

const AdminVideoCreate = () => {
  const classes = useStyles();
  const { videoId, isCreating } = useSelector(videoSelectors.state);
  const dispatch = useDispatch<ThunkDispatch>();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [errorMessage, setErrorMessage] = useState('');
  const methods = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      expiredAt: {},
    },
  });
  const { reset, handleSubmit } = methods;

  const getCastList = useCallback(() => {
    dispatch(castListOperations.get());
  }, [dispatch]);

  useEffect(() => {
    const videoId = videoCollection().doc().id;
    dispatch(videoActions.setVideoId({ videoId }));
    getCastList();
  }, [dispatch, getCastList]);

  const create = useCallback(
    (params: VideoParams) => {
      if (!videoId) return;
      dispatch(
        videoOperations.create(
          videoId,
          params,
          () => {
            enqueueSnackbar('動画を作成しました', {
              variant: 'success',
            });
            reset();
            router.push('/admin/video/list');
          },
          (error: string) => {
            enqueueSnackbar('動画の作成に失敗しました', {
              variant: 'error',
            });
            setErrorMessage(error);
          },
        ),
      );
    },
    [dispatch, enqueueSnackbar, reset, router, videoId],
  );

  const onSubmit = handleSubmit((data) => {
    setErrorMessage('');
    create(data);
  });

  return (
    <AdminTemplate
      goBackOption={{
        href: '/admin/video/list',
        as: '/admin/video/list',
        label: '一覧に戻る',
      }}
      isLoading={isCreating}
    >
      <div className={classes.container}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} style={{ height: '100%' }}>
            <div className={classes.header}>
              <Typography variant="h2" className={classes.title}>
                動画を投稿
              </Typography>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                startIcon={
                  isCreating ? (
                    <CircularProgress size={16} />
                  ) : (
                    <NoteAddOutlinedIcon />
                  )
                }
                disabled={isCreating}
              >
                保存する
              </Button>
            </div>
            <Grid container className={classes.gridContainer} spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.formContainer}>
                  {errorMessage && (
                    <p className={classes.errorMessage}>{errorMessage}</p>
                  )}
                  {videoId && <VideoForm videoId={videoId} />}
                </Paper>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </div>
    </AdminTemplate>
  );
};

export default AdminVideoCreate;
