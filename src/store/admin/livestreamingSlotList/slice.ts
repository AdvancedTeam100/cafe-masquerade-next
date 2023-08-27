import { LivestreamingSlot } from '@/libs/models/livestreamingSlot';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LivestreamingSlotListState } from './index';

type SuccessGet = {
  livestreamingSlots: LivestreamingSlot[];
};

const initialState: LivestreamingSlotListState = {
  isInitialized: false,
  isFetching: false,
  isCreating: false,
  isUpdating: false,
  livestreamingSlots: [],
};

const livestreamingSlotListSlice = createSlice({
  name: 'admin/livestreamingSlotList',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
      state.isInitialized = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.isFetching = false;
      state.livestreamingSlots = action.payload.livestreamingSlots;
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
  },
});

export const actions = livestreamingSlotListSlice.actions;

export const reducer = livestreamingSlotListSlice.reducer;
