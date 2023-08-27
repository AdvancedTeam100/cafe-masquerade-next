import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { ThunkDispatch } from '@/store';
import { castOperations, castSelectors } from '@/store/admin/cast';
import {
  homeContentOperations,
  homeContentSelectors,
} from '@/store/admin/homeContent';
import { getCastSchedules } from '@/libs/firebase/firestore/schedule';
import { getCastYoutubeVideos } from '@/libs/firebase/firestore/youtubeVideo';
import { YoutubeVideo } from '@/libs/models/youtubeVideo';
import PreviewWrapper from '@/containers/admin/PreviewWrapper';
import CastDetailContainer from '@/containers/common/CastDetailContainer';
import { CastSchedule } from '@/libs/models/castSchedule';

const AdminCastIdPreview = () => {
  const { cast, castImages } = useSelector(castSelectors.state);
  const { homeContent } = useSelector(homeContentSelectors.state);
  const dispatch = useDispatch<ThunkDispatch>();
  const [castSchedules, setCastSchedules] = useState<CastSchedule[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
  const router = useRouter();
  const castId = router.query.castId as string;

  const get = useCallback(
    (castId) => {
      dispatch(castOperations.get(castId));
    },
    [dispatch],
  );

  const getHomeContent = useCallback(() => {
    dispatch(homeContentOperations.get());
  }, [dispatch]);

  useEffect(() => {
    if (castId) {
      get(castId);
      getHomeContent();
      (async () => {
        const castSchedules = await getCastSchedules(castId);
        setCastSchedules(castSchedules);

        const youtubeVideos = await getCastYoutubeVideos(castId);
        setYoutubeVideos(youtubeVideos);
      })();
    }
  }, [get, getHomeContent, castId]);

  return (
    <PreviewWrapper>
      <CastDetailContainer
        cast={cast}
        castImages={castImages}
        castSchedules={castSchedules}
        homeContent={homeContent}
        youtubeVideos={youtubeVideos}
      />
    </PreviewWrapper>
  );
};

export default AdminCastIdPreview;
