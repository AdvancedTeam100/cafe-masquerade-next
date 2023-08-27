import { useCallback, useState } from 'react';
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
import { FormData, validationSchema } from '@/config/form/cast';
import { getDateStringHyphens } from '@/libs/utils/dateFormat';
import { CastStatus } from '@/libs/models/cast';
import { ThunkDispatch } from '@/store';
import { CastParams, castOperations, castSelectors } from '@/store/admin/cast';
import { castListOperations } from '@/store/admin/castList';
import AdminTemplate from '@/containers/admin/Template';
import CastForm from '@/containers/admin/CastForm';
import CastTagList from '@/containers/admin/CastTagList';
import AdminCastNotifications from '@/containers/admin/CastNotifications';

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
    margin: theme.spacing(0, 0, 2),
  },
  subTitle: {
    fontSize: '1.1rem',
  },
}));

const AdminCastCreate = () => {
  const classes = useStyles();
  const { isCreating } = useSelector(castSelectors.state);
  const dispatch = useDispatch<ThunkDispatch>();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [errorMessage, setErrorMessage] = useState('');
  const methods = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
      selfIntroduction: '',
      physicalInformation: {
        height: 150,
        weight: 50,
        bustSize: 80,
        waistSize: 50,
        hipSize: 80,
        cupSize: 'C',
      },
      status: CastStatus.Draft,
      youtubeChannelId: '',
      youtubeChannelIdSecond: '',
      socialId: { twitter: '', twitcasting: '', tiktok: '', niconico: '' },
      joinedAt: getDateStringHyphens(new Date()),
      image: undefined,
      tags: [],
      images: [{ id: '', imageUrl: '' }],
      notificationDiscordUrl: null,
    },
  });
  const { reset, handleSubmit } = methods;

  const getList = useCallback(() => {
    dispatch(castListOperations.get());
  }, [dispatch]);

  const create = useCallback(
    (params: CastParams) => {
      dispatch(
        castOperations.create(
          params,
          () => {
            enqueueSnackbar('キャストを作成しました', {
              variant: 'success',
            });
            reset();
            router.push(`/admin/cast/${params.id}`);
            getList();
          },
          (error: string) => {
            enqueueSnackbar('キャストの作成に失敗しました', {
              variant: 'error',
            });
            setErrorMessage(error);
          },
        ),
      );
    },
    [dispatch, enqueueSnackbar, reset, router, getList],
  );

  const onSubmit = handleSubmit((data) => {
    if (data.image === undefined || data.images.length === 0) {
      setErrorMessage('画像をアップロードしてください');
    } else {
      setErrorMessage('');
      const params: CastParams = {
        ...data,
        images: data.images as File[],
      };
      create(params);
    }
  });

  return (
    <AdminTemplate
      goBackOption={{
        href: '/admin/cast/list',
        as: '/admin/cast/list',
        label: '一覧に戻る',
      }}
      isLoading={isCreating}
    >
      <div className={classes.container}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} style={{ height: '100%' }}>
            <div className={classes.header}>
              <Typography variant="h2" className={classes.title}>
                キャスト作成
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
              <Grid item xs={9}>
                <Paper className={classes.formContainer}>
                  {errorMessage && (
                    <p className={classes.errorMessage}>{errorMessage}</p>
                  )}
                  <CastForm />
                </Paper>
              </Grid>
              <Grid item xs={3}>
                <Paper className={classes.sideContainer}>
                  <Typography variant="h3" className={classes.subTitle}>
                    タグ
                  </Typography>
                  <CastTagList initialTags={[]} />
                </Paper>
                <Paper className={classes.sideContainer}>
                  <Typography variant="h3" className={classes.subTitle}>
                    通知設定
                  </Typography>
                  <AdminCastNotifications />
                </Paper>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </div>
    </AdminTemplate>
  );
};

export default AdminCastCreate;
