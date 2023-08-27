import { CastTag } from '@/libs/models/castTag';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CastTagListState } from './index';

type SuccessGet = {
  castTags: CastTag[];
};

type SuccessCreate = {
  castTag: CastTag;
};

type SuccessDelete = {
  castTagName: string;
};

const initialState: CastTagListState = {
  isFetching: false,
  isCreating: false,
  isDeleting: false,
  castTags: [],
};

const castTagListSlice = createSlice({
  name: 'admin/castTagList',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.isFetching = false;
      state.castTags = action.payload.castTags;
    },
    failureGet(state) {
      state.isFetching = false;
    },
    requestCreate(state) {
      state.isCreating = true;
    },
    successCreate(state, action: PayloadAction<SuccessCreate>) {
      state.isCreating = false;
      state.castTags = [...state.castTags, action.payload.castTag];
    },
    failureCreate(state) {
      state.isCreating = false;
    },
    requestDelete(state) {
      state.isCreating = true;
    },
    successDelete(state, action: PayloadAction<SuccessDelete>) {
      state.isCreating = false;
      state.castTags = state.castTags.filter(
        (tag) => tag.name !== action.payload.castTagName,
      );
    },
    failureDelete(state) {
      state.isCreating = false;
    },
  },
});

export const actions = castTagListSlice.actions;

export const reducer = castTagListSlice.reducer;
