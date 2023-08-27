import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { convertToRaw } from 'draft-js';
import { copyToClipboard } from '@/libs/utils/text';
import draftToHtml from 'draftjs-to-html';
import { yupResolver } from '@hookform/resolvers/yup';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import NoteAddOutlinedIcon from '@material-ui/icons/NoteAddOutlined';
import LaunchIcon from '@material-ui/icons/Launch';
import LinkIcon from '@material-ui/icons/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FormData, validationSchema } from '@/config/form/news';
import { colors } from '@/config/ui';
import { getISOString } from '@/libs/utils/dateFormat';
import { NewsStatus } from '@/libs/models/news';
import { ThunkDispatch } from '@/store';
import {
  NewsUpdateParams,
  newsOperations,
  newsSelectors,
} from '@/store/admin/news';
import { authSelectors } from '@/store/auth';
import { newsListOperations } from '@/store/admin/newsList';
import AdminTemplate from '@/containers/admin/Template';
import NewsForm from '@/containers/admin/NewsForm';
import NewsTagList from '@/containers/admin/NewsTagList';
import NewsInfo from '@/components/admin/NewsInfo';

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

const AdminNewsNewsId = () => {
  const classes = useStyles();
  const { isFetching, isUpdating, news } = useSelector(newsSelectors.state);
  const { user } = useSelector(authSelectors.state);
  const dispatch = useDispatch<ThunkDispatch>();
  const router = useRouter();
  const newsId = router.query.newsId as string;
  const [newsURL, setNewsURL] = useState('');
  const { enqueueSnackbar } = useSnackbar();
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
  const { handleSubmit } = methods;

  const get = useCallback(
    (newsId) => {
      dispatch(newsOperations.get(newsId));
    },
    [dispatch],
  );

  useEffect(() => {
    if (newsId) {
      get(newsId);
      setNewsURL(`${location.host}/news/${newsId}`);
    }
  }, [get, newsId]);

  const getList = useCallback(() => {
    dispatch(newsListOperations.get());
  }, [dispatch]);

  const deleteNews = useCallback(() => {
    if (confirm('本当に削除しますか？')) {
      dispatch(
        newsOperations.deleteNews(
          newsId,
          () => {
            enqueueSnackbar('お知らせを削除しました', {
              variant: 'success',
            });
            router.push('/admin/news/list');
          },
          () => {
            enqueueSnackbar('お知らせを削除しました', {
              variant: 'error',
            });
          },
        ),
      );
    }
  }, [newsId, dispatch, enqueueSnackbar, router]);

  const update = useCallback(
    (params: NewsUpdateParams) => {
      dispatch(
        newsOperations.update(
          newsId,
          params,
          () => {
            enqueueSnackbar('お知らせを保存しました', {
              variant: 'success',
            });
            router.push(`/admin/news/${newsId}`);
            get(newsId);
            getList();
          },
          (error: string) => {
            enqueueSnackbar('お知らせの保存に失敗しました', {
              variant: 'error',
            });
            setErrorMessage(error);
          },
        ),
      );
    },
    [dispatch, enqueueSnackbar, newsId, router, get, getList],
  );

  const onSubmit = handleSubmit((data) => {
    if (user === null || news === null) {
      setErrorMessage('しばらく経ってからアクセスしてください');
    } else {
      setErrorMessage('');
      const params: NewsUpdateParams = {
        ...data,
        content: draftToHtml(
          convertToRaw(data.contentState.getCurrentContent()),
        ),
        imageUrl: news.imageUrl,
        createdUserId: news.createdUserId,
        updatedUserId: user.uid,
      };
      update(params);
    }
  });

  return (
    <AdminTemplate
      goBackOption={{
        href: '/admin/news/list',
        as: '/admin/news/list',
        label: '一覧に戻る',
      }}
      isLoading={isFetching || isUpdating}
    >
      {news && news.id === newsId && (
        <div className={classes.container}>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit} style={{ height: '100%' }}>
              <div className={classes.header}>
                <Typography variant="h2" className={classes.title}>
                  お知らせ
                </Typography>
                <div>
                  {news.status !== NewsStatus.Draft && (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<LinkIcon />}
                      onClick={() => {
                        copyToClipboard(newsURL, () => {
                          enqueueSnackbar('このお知らせのURLをコピーしました', {
                            variant: 'success',
                          });
                        });
                      }}
                      style={{ marginRight: '8px' }}
                    >
                      リンクをコピー
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    type="submit"
                    startIcon={<LaunchIcon />}
                    href={`/admin/news/${newsId}/preview`}
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
              <Grid container className={classes.gridContainer} spacing={3}>
                <Grid item xs={9}>
                  <Paper className={classes.formContainer}>
                    {errorMessage && (
                      <p className={classes.errorMessage}>{errorMessage}</p>
                    )}
                    <NewsForm newsId={newsId} news={news} />
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper className={classes.sideContainer}>
                    <Typography variant="h3" className={classes.subTitle}>
                      記事の情報
                    </Typography>
                    {news && <NewsInfo news={news} />}
                  </Paper>
                  <Paper className={classes.sideContainer}>
                    <Typography variant="h3" className={classes.subTitle}>
                      タグ
                    </Typography>
                    {news && <NewsTagList initialTags={news.tags} />}
                  </Paper>
                  <Paper className={classes.sideContainer}>
                    <Typography variant="h3" className={classes.subTitle}>
                      操作
                    </Typography>
                    <p className={classes.dangerText} onClick={deleteNews}>
                      お知らせを削除する
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

export default AdminNewsNewsId;
