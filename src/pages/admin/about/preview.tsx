import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@/store';
import {
  aboutContentOperations,
  aboutContentSelectors,
} from '@/store/admin/aboutContent';
import {
  homeContentOperations,
  homeContentSelectors,
} from '@/store/admin/homeContent';
import PreviewWrapper from '@/containers/admin/PreviewWrapper';
import AboutContainer from '@/containers/common/AboutContainer';

const AdminAboutPreview = () => {
  const { homeContent } = useSelector(homeContentSelectors.state);
  const { aboutContent } = useSelector(aboutContentSelectors.state);
  const dispatch = useDispatch<ThunkDispatch>();

  const get = useCallback(() => {
    dispatch(aboutContentOperations.get());
  }, [dispatch]);

  const getHomeContent = useCallback(() => {
    dispatch(homeContentOperations.get());
  }, [dispatch]);

  useEffect(() => {
    get();
    getHomeContent();
  }, [get, getHomeContent]);

  return (
    <PreviewWrapper>
      <AboutContainer aboutContent={aboutContent} homeContent={homeContent} />
    </PreviewWrapper>
  );
};

export default AdminAboutPreview;
