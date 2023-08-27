import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { ThunkDispatch } from '@/store';
import { newsOperations, newsSelectors } from '@/store/admin/news';
import {
  homeContentOperations,
  homeContentSelectors,
} from '@/store/admin/homeContent';
import PreviewWrapper from '@/containers/admin/PreviewWrapper';
import NewsDetailContainer from '@/containers/common/NewsDetailContainer';
import { News } from '@/libs/models/news';
import { getLatestNews } from '@/libs/firebase/firestore/news';

const AdminNewsNewsIdPreview = () => {
  const { news } = useSelector(newsSelectors.state);
  const { homeContent } = useSelector(homeContentSelectors.state);
  const dispatch = useDispatch<ThunkDispatch>();
  const router = useRouter();
  const newsId = router.query.newsId as string;

  const get = useCallback(
    (newsId) => {
      dispatch(newsOperations.get(newsId));
    },
    [dispatch],
  );

  const getHomeContent = useCallback(() => {
    dispatch(homeContentOperations.get());
  }, [dispatch]);

  const [latestNews, setLatestNews] = useState<News[]>([]);
  useEffect(() => {
    (async () => {
      setLatestNews(await getLatestNews());
    })();
  }, [setLatestNews]);

  useEffect(() => {
    if (newsId) {
      get(newsId);
      getHomeContent();
    }
  }, [get, getHomeContent, newsId]);

  return (
    <PreviewWrapper>
      <NewsDetailContainer
        homeContent={homeContent}
        latestNews={latestNews}
        news={news}
      />
    </PreviewWrapper>
  );
};

export default AdminNewsNewsIdPreview;
