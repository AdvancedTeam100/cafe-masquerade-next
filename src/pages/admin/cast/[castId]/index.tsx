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
import LaunchIcon from '@material-ui/icons/Launch';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FormData, validationSchema } from '@/config/form/cast';
import { colors } from '@/config/ui';
import { getDateStringHyphens } from '@/libs/utils/dateFormat';
import { CastStatus } from '@/libs/models/cast';
import { ThunkDispatch } from '@/store';
import { CastParams, castOperations, castSelectors } from '@/store/admin/cast';
import { castListOperations } from '@/store/admin/castList';
import AdminTemplate from '@/containers/admin/Template';
import CastForm from '@/containers/admin/CastForm';
import CastTagList from '@/containers/admin/CastTagList';
import CastInfo from '@/components/admin/CastInfo';
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
    marginBottom: theme.spacing(2),
  },
  subTitle: {
    fontSize: '1.1rem',
  },
  dangerText: {
    margin: theme.spacing(3, 0),
    color: colors.grayText,
    cursor: 'pointer',
  },
}));

const AdminCastCastId = () => {
  const classes = useStyles();
  const { isFetching, isUpdating, cast, castImages } = useSelector(
    castSelectors.state,
  );
  const dispatch = useDispatch<ThunkDispatch>();
  const router = useRouter();
  const castId = router.query.castId as string;
  const { enqueueSnackbar } = useSnackbar();
  const [errorMessage, setErrorMessage] = useState('');
  const methods = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: castId,
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
      images: [],
      notificationDiscordUrl: null,
    },
  });
  const { handleSubmit } = methods;

  const get = useCallback(
    (castId) => {
      dispatch(castOperations.get(castId));
    },
    [dispatch],
  );

  useEffect(() => {
    if (castId) {
      get(castId);
    }
  }, [get, castId]);

  const getList = useCallback(() => {
    dispatch(castListOperations.get());
  }, [dispatch]);

  const deleteCast = useCallback(() => {
    if (confirm('本当に削除しますか？')) {
      dispatch(
        castOperations.deleteCast(
          castId,
          () => {
            enqueueSnackbar('キャストを削除しました', {
              variant: 'success',
            });
            router.push('/admin/cast/list');
          },
          () => {
            enqueueSnackbar('キャストを削除しました', {
              variant: 'error',
            });
          },
        ),
      );
    }
  }, [castId, dispatch, enqueueSnackbar, router]);

  const update = useCallback(
    (params: CastParams) => {
      dispatch(
        castOperations.update(
          castId,
          params,
          () => {
            enqueueSnackbar('キャストを保存しました', {
              variant: 'success',
            });
            router.push(`/admin/cast/${castId}`);
            get(castId);
            getList();
          },
          (error: string) => {
            enqueueSnackbar('キャストの保存に失敗しました', {
              variant: 'error',
            });
            setErrorMessage(error);
          },
        ),
      );
    },
    [dispatch, enqueueSnackbar, castId, router, get, getList],
  );

  const onSubmit = handleSubmit((data) => {
    if (cast === null) {
      setErrorMessage('しばらく経ってからアクセスしてください');
    } else {
      setErrorMessage('');
      const params: CastParams = {
        ...data,
        imageUrl: cast.imageUrl,
      };
      update(params);
    }
  });

  return (
    <AdminTemplate
      goBackOption={{
        href: '/admin/cast/list',
        as: '/admin/cast/list',
        label: '一覧に戻る',
      }}
      isLoading={isFetching || isUpdating}
    >
      {cast && cast.id === castId && (
        <div className={classes.container}>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit} style={{ height: '100%' }}>
              <div className={classes.header}>
                <Typography variant="h2" className={classes.title}>
                  キャスト
                </Typography>
                <div>
                  <Button
                    variant="outlined"
                    color="primary"
                    type="submit"
                    startIcon={<LaunchIcon />}
                    href={`/admin/cast/${castId}/preview`}
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{ marginRight: '8px' }}
                  >
                    プレビュー
                  </Button>
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
                  >
                    保存する
                  </Button>
                </div>
              </div>
              <Grid container className={classes.gridContainer} spacing={3}>
                <Grid item xs={9}>
                  <Paper className={classes.formContainer}>
                    {errorMessage && (
                      <p className={classes.errorMessage}>{errorMessage}</p>
                    )}
                    <CastForm cast={cast} castImages={castImages} />
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper className={classes.sideContainer}>
                    <Typography variant="h3" className={classes.subTitle}>
                      キャストの情報
                    </Typography>
                    {cast && <CastInfo cast={cast} />}
                  </Paper>
                  <Paper className={classes.sideContainer}>
                    <Typography variant="h3" className={classes.subTitle}>
                      タグ
                    </Typography>
                    {cast && <CastTagList initialTags={cast.tags} />}
                  </Paper>
                  <Paper className={classes.sideContainer}>
                    <Typography variant="h3" className={classes.subTitle}>
                      通知設定
                    </Typography>
                    {cast && (
                      <AdminCastNotifications
                        initialDiscordUrl={cast.notificationDiscordUrl}
                      />
                    )}
                  </Paper>
                  <Paper className={classes.sideContainer}>
                    <Typography variant="h3" className={classes.subTitle}>
                      操作
                    </Typography>
                    <p className={classes.dangerText} onClick={deleteCast}>
                      キャストを削除する
                    </p>
                  </Paper>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </div>
      )}
    </AdminTemplate>
  );
};

export default AdminCastCastId;
