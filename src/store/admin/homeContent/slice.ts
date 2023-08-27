import { HomeContent } from '@/libs/models/content';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HomeContentState } from './index';

type SuccessGet = {
  homeContent: HomeContent;
};

const initialState: HomeContentState = {
  isFetching: false,
  isUpdating: false,
  homeContent: null,
};

const homeContentSlice = createSlice({
  name: 'admin/homeContent',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.isFetching = false;
      state.homeContent = action.payload.homeContent;
    },
    failureGet(state) {
      state.isFetching = false;
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

export const actions = homeContentSlice.actions;

export const reducer = homeContentSlice.reducer;
