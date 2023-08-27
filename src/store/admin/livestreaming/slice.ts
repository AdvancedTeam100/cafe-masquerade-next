import { Livestreaming } from '@/libs/models/livestreaming';
import {
  LivestreamingInfo,
  LivestreamingPassword,
} from '@/libs/models/livestreamingCredential';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LivestreamingState } from './index';

type SuccessGet = {
  livestreaming: Livestreaming;
  livestreamingPassword: LivestreamingPassword;
  livestreamingInfo: LivestreamingInfo | null;
};

const initialState: LivestreamingState = {
  isFetching: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  livestreaming: null,
  livestreamingPassword: null,
  livestreamingInfo: null,
};

const livestreamingSlice = createSlice({
  name: 'admin/livestreaming',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.isFetching = false;
      state.livestreaming = action.payload.livestreaming;
      state.livestreamingPassword = action.payload.livestreamingPassword;
      state.livestreamingInfo = action.payload.livestreamingInfo;
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
    resetState() {
      return initialState;
    },
  },
});

export const actions = livestreamingSlice.actions;

export const reducer = livestreamingSlice.reducer;
