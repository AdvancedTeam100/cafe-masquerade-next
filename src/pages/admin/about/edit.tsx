import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { EditorState, convertToRaw } from 'draft-js';
import { useSnackbar } from 'notistack';
import draftToHtml from 'draftjs-to-html';
import { yupResolver } from '@hookform/resolvers/yup';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import NoteAddOutlinedIcon from '@material-ui/icons/NoteAddOutlined';
import LaunchIcon from '@material-ui/icons/Launch';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FormData, validationSchema } from '@/config/form/aboutContent';
import { ThunkDispatch } from '@/store';
import {
  AboutContentParams,
  aboutContentOperations,
  aboutContentSelectors,
} from '@/store/admin/aboutContent';
import AdminTemplate from '@/containers/admin/Template';
import AboutContentForm from '@/containers/admin/AboutContentForm';

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

const AdminAboutEdit = () => {
  const classes = useStyles();
  const { isFetching, isUpdating, aboutContent } = useSelector(
    aboutContentSelectors.state,
  );
  const dispatch = useDispatch<ThunkDispatch>();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [errorMessage, setErrorMessage] = useState('');
  const methods = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      contents: [
        {
          title: '',
          subTitle: '',
          contentState: EditorState.createEmpty(),
        },
      ],
    },
  });
  const { reset, handleSubmit } = methods;

  const get = useCallback(() => {
    dispatch(aboutContentOperations.get());
  }, [dispatch]);

  useEffect(() => {
    get();
  }, [get]);

  const update = useCallback(
    (params: AboutContentParams) => {
      dispatch(
        aboutContentOperations.update(
          params,
          () => {
            enqueueSnackbar('ご利用方法を更新しました', {
              variant: 'success',
            });
            reset();
            router.push('/admin/about/edit');
            get();
          },
          (error: string) => {
            enqueueSnackbar('ご利用方法の更新に失敗しました', {
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
    const contents = data.contents.map((content) => ({
      title: content.title,
      subTitle: content.subTitle,
      content: draftToHtml(
        convertToRaw(content.contentState.getCurrentContent()),
      ),
    }));
    update({ contents });
  });

  return (
    <AdminTemplate isLoading={isFetching || isUpdating}>
      <div className={classes.container}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} style={{ height: '100%' }}>
            <div className={classes.header}>
              <Typography variant="h2" className={classes.title}>
                ご利用方法
              </Typography>
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  type="submit"
                  startIcon={<LaunchIcon />}
                  href={'/admin/about/preview'}
                  target="_blank"
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
            <Grid container className={classes.gridContainer}>
              <Grid item xs={12}>
                <Paper className={classes.formContainer}>
                  {errorMessage && (
                    <p className={classes.errorMessage}>{errorMessage}</p>
                  )}
                  <AboutContentForm aboutContent={aboutContent} />
                </Paper>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </div>
    </AdminTemplate>
  );
};

export default AdminAboutEdit;
