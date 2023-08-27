import { BlockedContactUser } from '@/libs/models/blockedContactUser';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { BlockedContactUserState } from './index';

type SuccessGet = {
  blockedContactUser: BlockedContactUser;
};

const initialState: BlockedContactUserState = {
  isFetching: false,
  isCreating: false,
  isUpdating: false,
  blockedContactUser: null,
};

const blockedContactUserSlice = createSlice({
  name: 'admin/blockedContactUser',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.isFetching = false;
      state.blockedContactUser = action.payload.blockedContactUser;
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

export const actions = blockedContactUserSlice.actions;

export const reducer = blockedContactUserSlice.reducer;
