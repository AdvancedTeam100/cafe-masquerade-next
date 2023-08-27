import { News, NewsStatus } from '@/libs/models/news';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NewsListState } from './index';

type SuccessGet = {
  newsList: News[];
};

type SetLoadingNewsId = {
  newsId: string;
};

type UpdateNewsItemStatus = {
  newsId: string;
  status: NewsStatus;
};

type RemoveNewsItem = {
  newsId: string;
};

const initialState: NewsListState = {
  isInitialized: false,
  isFetching: false,
  loadingNewsId: '',
  newsList: [],
};

const newsListSlice = createSlice({
  name: 'admin/newsList',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
      state.isInitialized = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.isFetching = false;
      state.newsList = action.payload.newsList;
    },
    failureGet(state) {
      state.isFetching = false;
    },
    setLoadingNewsId(state, action: PayloadAction<SetLoadingNewsId>) {
      state.loadingNewsId = action.payload.newsId;
    },
    updateNewsItemStatus(state, action: PayloadAction<UpdateNewsItemStatus>) {
      state.newsList = state.newsList.map((news) => {
        if (news.id === action.payload.newsId) {
          return {
            ...news,
            status: action.payload.status,
          };
        } else {
          return news;
        }
      });
    },
    removeNewsItem(state, action: PayloadAction<RemoveNewsItem>) {
      state.newsList = state.newsList.filter(
        (news) => news.id !== action.payload.newsId,
      );
    },
  },
});

export const actions = newsListSlice.actions;

export const reducer = newsListSlice.reducer;
