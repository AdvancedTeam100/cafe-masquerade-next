import { storage } from '@/libs/firebase';
import { newsConverter, newsDocument } from '@/libs/firebase/firestore/news';
import { ThunkAction } from '@/store';
import { News, NewsStatus } from '@/libs/models/news';
import { newsListActions } from '../newsList';
import { actions } from './slice';
import { NewsCreateParams, NewsUpdateParams } from '.';

export const get = (newsId: string): ThunkAction<Promise<void>> => async (
  dispatch,
) => {
  dispatch(actions.requestGet());
  try {
    const newsQuerySnap = await newsDocument(newsId)
      .withConverter(newsConverter)
      .get();
    const news = newsQuerySnap.data();
    if (news) {
      dispatch(actions.successGet({ news }));
    } else {
      dispatch(actions.failureGet());
    }
  } catch (e) {
    console.log(e);
    dispatch(actions.failureGet());
  }
};

export const create = (
  newsId: string,
  params: NewsCreateParams,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestCreate());
  try {
    const storageRef = storage.ref();
    let imageUrl = '';
    if (params.image) {
      const uploadTaskSnap = await storageRef
        .child(`news/${newsId}/images/${new Date().getTime()}`)
        .put(params.image);

      imageUrl = await uploadTaskSnap.ref.getDownloadURL();
    }
    const news: News = {
      id: newsId,
      title: params.title,
      description: params.description,
      content: params.content,
      imageUrl,
      status: params.status,
      tags: params.tags,
      createdUserId: params.createdUserId,
      updatedUserId: params.createdUserId,
      publishedAt: params.publishedAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await newsDocument(newsId).withConverter(newsConverter).set(news);
    dispatch(actions.successCreate());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureCreate());
    failureCallback(e?.message ?? '');
    return;
  }
};

export const update = (
  newsId: string,
  params: NewsUpdateParams,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());
  try {
    let imageUrl = params.imageUrl;
    if (params.image) {
      const storageRef = storage.ref();
      const uploadTaskSnap = await storageRef
        .child(`news/${newsId}/images/${new Date().getTime()}`)
        .put(params.image);
      imageUrl = await uploadTaskSnap.ref.getDownloadURL();
    }
    await newsDocument(newsId)
      .withConverter(newsConverter)
      .update({
        title: params.title,
        description: params.description,
        content: params.content,
        imageUrl,
        status: params.status,
        tags: params.tags,
        publishedAt: new Date(params.publishedAt),
        updatedUserId: params.updatedUserId,
        updatedAt: new Date(),
      });
    dispatch(actions.successUpdate());
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdate());
    failureCallback(e?.message ?? '');
    return;
  }
};

export const updateStatus = (
  newsId: string,
  status: NewsStatus,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());
  dispatch(newsListActions.setLoadingNewsId({ newsId }));
  try {
    await newsDocument(newsId).withConverter(newsConverter).update({
      status,
      updatedAt: new Date(),
    });
    dispatch(actions.successUpdate());
    dispatch(newsListActions.updateNewsItemStatus({ newsId, status }));
    dispatch(newsListActions.setLoadingNewsId({ newsId: '' }));
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdate());
    dispatch(newsListActions.setLoadingNewsId({ newsId: '' }));
    failureCallback(e?.message ?? '');
    return;
  }
};

export const deleteNews = (
  newsId: string,
  successCallback: () => void,
  failureCallback: (errorMessage: string) => void,
): ThunkAction<Promise<void>> => async (dispatch) => {
  dispatch(actions.requestUpdate());
  dispatch(newsListActions.setLoadingNewsId({ newsId }));
  try {
    await newsDocument(newsId).delete();
    dispatch(actions.successUpdate());
    dispatch(newsListActions.removeNewsItem({ newsId }));
    dispatch(newsListActions.setLoadingNewsId({ newsId: '' }));
    successCallback();
  } catch (e) {
    console.log(e);
    dispatch(actions.failureUpdate());
    dispatch(newsListActions.setLoadingNewsId({ newsId: '' }));
    failureCallback(e?.message ?? '');
    return;
  }
};
