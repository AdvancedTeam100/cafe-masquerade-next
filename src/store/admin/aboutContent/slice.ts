import { AboutContent } from '@/libs/models/content';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AboutContentState } from './index';

type SuccessGet = {
  aboutContent: AboutContent;
};

const initialState: AboutContentState = {
  isFetching: false,
  isUpdating: false,
  aboutContent: null,
};

const aboutContentSlice = createSlice({
  name: 'admin/aboutContent',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.isFetching = false;
      state.aboutContent = action.payload.aboutContent;
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

export const actions = aboutContentSlice.actions;

export const reducer = aboutContentSlice.reducer;
