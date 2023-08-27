import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { yupResolver } from '@hookform/resolvers/yup';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import NoteAddOutlinedIcon from '@material-ui/icons/NoteAddOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FormData, validationSchema } from '@/config/form/news';
import { getISOString } from '@/libs/utils/dateFormat';
import { NewsStatus } from '@/libs/models/news';
import { newsCollection } from '@/libs/firebase/firestore/news';
import { ThunkDispatch } from '@/store';
import {
  NewsCreateParams,
  newsOperations,
  newsSelectors,
} from '@/store/admin/news';
import { authSelectors } from '@/store/auth';
import { newsListOperations } from '@/store/admin/newsList';
import AdminTemplate from '@/containers/admin/Template';
import NewsForm from '@/containers/admin/NewsForm';
import NewsTagList from '@/containers/admin/NewsTagList';

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

const AdminNewsCreate = () => {
  const classes = useStyles();
  const { isCreating } = useSelector(newsSelectors.state);
  const { user } = useSelector(authSelectors.state);
  const dispatch = useDispatch<ThunkDispatch>();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [newsId] = useState(newsCollection().doc().id);
  const [errorMessage, setErrorMessage] = useState('');
  const methods = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: '',
      description: '',
      status: NewsStatus.Draft,
      publishedAt: getISOString(new Date()),
      image: undefined,
      tags: [],
    },
  });
  const { reset, handleSubmit } = methods;

  const getList = useCallback(() => {
    dispatch(newsListOperations.get());
  }, [dispatch]);

  const create = useCallback(
    (params: NewsCreateParams) => {
      dispatch(
        newsOperations.create(
          newsId,
          params,
          () => {
            enqueueSnackbar('お知らせを作成しました', {
              variant: 'success',
            });
            reset();
            router.push(`/admin/news/${newsId}`);
            getList();
          },
          (error: string) => {
            enqueueSnackbar('お知らせの作成に失敗しました', {
              variant: 'error',
            });
            setErrorMessage(error);
          },
        ),
      );
    },
    [dispatch, enqueueSnackbar, newsId, reset, router, getList],
  );

  const onSubmit = handleSubmit((data) => {
    if (user) {
      setErrorMessage('');
      const params: NewsCreateParams = {
        ...data,
        content: draftToHtml(
          convertToRaw(data.contentState.getCurrentContent()),
        ),
        createdUserId: user.uid,
      };
      create(params);
    }
  });

  return (
    <AdminTemplate
      goBackOption={{
        href: '/admin/news/list',
        as: '/admin/news/list',
        label: '一覧に戻る',
      }}
      isLoading={isCreating}
    >
      <div className={classes.container}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} style={{ height: '100%' }}>
            <div className={classes.header}>
              <Typography variant="h2" className={classes.title}>
                お知らせ作成
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
                  <NewsForm newsId={newsId} />
                </Paper>
              </Grid>
              <Grid item xs={3}>
                <Paper className={classes.sideContainer}>
                  <Typography variant="h3" className={classes.subTitle}>
                    タグ
                  </Typography>
                  <NewsTagList initialTags={[]} />
                </Paper>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </div>
    </AdminTemplate>
  );
};

export default AdminNewsCreate;
