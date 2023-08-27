import { Video } from '@/libs/models/video';
import { VideoInfo } from '@/libs/models/videoCredential';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { VideoState } from './index';

type SuccessGet = {
  video: Video;
  videoInfo: VideoInfo | null;
};

type SetVideoId = {
  videoId: string;
};

type SetIsEnableToPlay = {
  isEnableToPlay: boolean;
};

const initialState: VideoState = {
  isFetching: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isRequestingTranscode: false,
  isEnableToPlay: false,
  videoId: null,
  video: null,
  videoInfo: null,
};

const videoSlice = createSlice({
  name: 'admin/video',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.isFetching = false;
      state.video = action.payload.video;
      state.videoInfo = action.payload.videoInfo;
    },
    failureGet(state) {
      state.isFetching = false;
    },
    setVideoId(state, action: PayloadAction<SetVideoId>) {
      state.videoId = action.payload.videoId;
      state.isEnableToPlay = false;
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
    setIsEnableToPlay(state, action: PayloadAction<SetIsEnableToPlay>) {
      state.isEnableToPlay = action.payload.isEnableToPlay;
    },
    requestTranscoding(state) {
      state.isRequestingTranscode = true;
    },
    successTranscoding(state) {
      state.isRequestingTranscode = false;
    },
    failureTranscoding(state) {
      state.isRequestingTranscode = false;
    },
  },
});

export const actions = videoSlice.actions;

export const reducer = videoSlice.reducer;
