import { News } from '@/libs/models/news';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NewsState } from './index';

type SuccessGet = {
  news: News;
};

const initialState: NewsState = {
  isFetching: false,
  isCreating: false,
  isUpdating: false,
  news: null,
};

const newsSlice = createSlice({
  name: 'admin/news',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.isFetching = false;
      state.news = action.payload.news;
    },
    failureGet(state) {
      state.isFetching = false;
    },
    requestCreate(state) {
      state.isCreating = true;
    },
    successCreate(state) {
      state.isCreating = false;
    },
    failureCreate(state) {
      state.isCreating = false;
    },
    requestUpdate(state) {
      state.isUpdating = true;
    },
    successUpdate(state) {
      state.isUpdating = false;
    },
    failureUpdate(state) {
      state.isUpdating = false;
    },
  },
});

export const actions = newsSlice.actions;

export const reducer = newsSlice.reducer;
