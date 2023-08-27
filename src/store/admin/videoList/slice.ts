import { Video } from '@/libs/models/video';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { VideoListState } from './index';

type SuccessGet = {
  videoList: Video[];
};

const initialState: VideoListState = {
  isFetching: false,
  videoList: [],
};

const videoListSlice = createSlice({
  name: 'admin/videoList',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.isFetching = false;
      state.videoList = action.payload.videoList;
    },
    failureGet(state) {
      state.isFetching = false;
    },
  },
});

export const actions = videoListSlice.actions;

export const reducer = videoListSlice.reducer;
