import { Livestreaming } from '@/libs/models/livestreaming';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LivestreamingListState } from './index';

type SetStreamingList = {
  livestreamings: Livestreaming[];
};

type SetScheduledList = SetStreamingList;
type SetFinishedList = SetStreamingList;

const initialState: LivestreamingListState = {
  isInitialized: false,
  isFetching: false,
  streamingList: [],
  scheduledList: [],
  finishedList: [],
};

const livestreamingListSlice = createSlice({
  name: 'admin/livestreamingList',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
      state.isInitialized = true;
    },
    setStreamingList(state, action: PayloadAction<SetStreamingList>) {
      state.streamingList = action.payload.livestreamings;
    },
    setScheduledList(state, action: PayloadAction<SetScheduledList>) {
      state.scheduledList = action.payload.livestreamings;
    },
    setFinishedList(state, action: PayloadAction<SetFinishedList>) {
      state.finishedList = action.payload.livestreamings;
    },
    successGet(state) {
      state.isFetching = false;
    },
    failureGet(state) {
      state.isFetching = false;
    },
  },
});

export const actions = livestreamingListSlice.actions;

export const reducer = livestreamingListSlice.reducer;
