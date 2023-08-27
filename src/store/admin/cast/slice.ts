import { Cast } from '@/libs/models/cast';
import { CastImage } from '@/libs/models/castImage';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CastState } from './index';

type SuccessGet = {
  cast: Cast;
  castImages: CastImage[];
};

const initialState: CastState = {
  isFetching: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  cast: null,
  castImages: [],
};

const castSlice = createSlice({
  name: 'admin/cast',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.isFetching = false;
      state.cast = action.payload.cast;
      state.castImages = action.payload.castImages;
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
    requestDelete(state) {
      state.isDeleting = true;
    },
    successDelete(state) {
      state.isDeleting = false;
    },
    failureDelete(state) {
      state.isDeleting = false;
    },
  },
});

export const actions = castSlice.actions;

export const reducer = castSlice.reducer;
