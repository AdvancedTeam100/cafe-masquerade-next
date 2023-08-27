import { NewsTag } from '@/libs/models/newsTag';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NewsTagListState } from './index';

type SuccessGet = {
  newsTags: NewsTag[];
};

type SuccessCreate = {
  newsTag: NewsTag;
};

type SuccessDelete = {
  newsTagName: string;
};

const initialState: NewsTagListState = {
  isFetching: false,
  isCreating: false,
  isDeleting: false,
  newsTags: [],
};

const newsTagListSlice = createSlice({
  name: 'admin/newsTagList',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.isFetching = false;
      state.newsTags = action.payload.newsTags;
    },
    failureGet(state) {
      state.isFetching = false;
    },
    requestCreate(state) {
      state.isCreating = true;
    },
    successCreate(state, action: PayloadAction<SuccessCreate>) {
      state.isCreating = false;
      state.newsTags = [...state.newsTags, action.payload.newsTag];
    },
    failureCreate(state) {
      state.isCreating = false;
    },
    requestDelete(state) {
      state.isCreating = true;
    },
    successDelete(state, action: PayloadAction<SuccessDelete>) {
      state.isCreating = false;
      state.newsTags = state.newsTags.filter(
        (tag) => tag.name !== action.payload.newsTagName,
      );
    },
    failureDelete(state) {
      state.isCreating = false;
    },
  },
});

export const actions = newsTagListSlice.actions;

export const reducer = newsTagListSlice.reducer;
