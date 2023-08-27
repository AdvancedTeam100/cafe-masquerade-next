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
import { FormData, validationSchema } from '@/config/form/homeContent';
import { ThunkDispatch } from '@/store';
import {
  HomeContentParams,
  homeContentOperations,
  homeContentSelectors,
} from '@/store/admin/homeContent';
import AdminTemplate from '@/containers/admin/Template';
import HomeContentForm from '@/containers/admin/HomeContentForm';

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

const AdminHomeEdit = () => {
  const classes = useStyles();
  const { isFetching, isUpdating, homeContent } = useSelector(
    homeContentSelectors.state,
  );
  const dispatch = useDispatch<ThunkDispatch>();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [errorMessage, setErrorMessage] = useState('');
  const methods = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      sideLinks: [{ title: '', href: '' }],
      topImages: [{ url: '', href: '' }],
    },
  });
  const { reset, handleSubmit } = methods;

  const get = useCallback(() => {
    dispatch(homeContentOperations.get());
  }, [dispatch]);

  useEffect(() => {
    get();
  }, [get]);

  const update = useCallback(
    (params: HomeContentParams) => {
      dispatch(
        homeContentOperations.update(
          params,
          () => {
            enqueueSnackbar('ホーム画面を更新しました', {
              variant: 'success',
            });
            reset();
            router.push('/admin/home/edit');
            get();
          },
          (error: string) => {
            enqueueSnackbar('ホーム画面の更新に失敗しました', {
              variant: 'error',
            });
            setErrorMessage(error);
          },
        ),
      );
    },
    [dispatch, enqueueSnackbar, reset, router, get],
  );

  const onSubmit = handleSubmit((data) => {
    setErrorMessage('');
    update(data);
  });

  return (
    <AdminTemplate isLoading={isFetching || isUpdating}>
      <div className={classes.container}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} style={{ height: '100%' }}>
            <div className={classes.header}>
              <Typography variant="h2" className={classes.title}>
                ホーム画面
              </Typography>
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
            <Grid container className={classes.gridContainer}>
              <Grid item xs={12}>
                <Paper className={classes.formContainer}>
                  {errorMessage && (
                    <p className={classes.errorMessage}>{errorMessage}</p>
                  )}
                  <HomeContentForm homeContent={homeContent} />
                </Paper>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </div>
    </AdminTemplate>
  );
};

export default AdminHomeEdit;
