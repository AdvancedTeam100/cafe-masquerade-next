import { Livestreaming } from '@/libs/models/livestreaming';
import { LivestreamingInfo } from '@/libs/models/livestreamingCredential';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LivestreamingState } from '.';

type SuccessGet = {
  livestreaming: Livestreaming;
};

type SetLivestreaming = {
  livestreaming: Livestreaming;
};

type SetLivestreamingInfo = {
  info: LivestreamingInfo;
};

type SuccessGetInfo = {
  info: LivestreamingInfo;
};

type SuccessCheckPass = {
  hasAccepted: boolean;
  info?: LivestreamingInfo;
};

const initialState: LivestreamingState = {
  hasAcceptedPass: false,
  info: null,
  isFetching: false,
  isCheckingPass: false,
  livestreaming: null,
};

const livestreamingSlice = createSlice({
  name: 'app/livestreaming',
  initialState,
  reducers: {
    setLivestreaming(state, action: PayloadAction<SetLivestreaming>) {
      state.livestreaming = action.payload.livestreaming;
    },
    setLivestreamingInfo(state, action: PayloadAction<SetLivestreamingInfo>) {
      state.info = action.payload.info;
    },
    requestGet(state) {
      state.isFetching = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.livestreaming = action.payload.livestreaming;
      state.isFetching = false;
    },
    failureGet(state) {
      state.isFetching = false;
    },
    requestGetInfo(state) {
      state.isFetching = true;
    },
    successGetInfo(state, action: PayloadAction<SuccessGetInfo>) {
      state.info = action.payload.info;
      state.isFetching = false;
    },
    failureGetInfo(state) {
      state.isFetching = false;
    },
    requestCheckPass(state) {
      state.isCheckingPass = true;
      state.hasAcceptedPass = false;
    },
    successCheckPass(state, action: PayloadAction<SuccessCheckPass>) {
      state.isCheckingPass = false;

      const { hasAccepted, info } = action.payload;
      if (hasAccepted) {
        state.hasAcceptedPass = hasAccepted;
        state.info = info ?? null;
      }
    },
    failureCheckPass(state) {
      state.isCheckingPass = false;
    },
  },
});

export const actions = livestreamingSlice.actions;

export const reducer = livestreamingSlice.reducer;
