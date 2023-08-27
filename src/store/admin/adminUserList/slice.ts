import { AdminUser } from '@/libs/models/adminUser';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AdminUserListState } from './index';

type SuccessGet = {
  adminUserList: AdminUser[];
};

const initialState: AdminUserListState = {
  isInitialized: false,
  isFetching: false,
  adminUserList: [],
};

const adminUserListSlice = createSlice({
  name: 'admin/adminUserList',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
      state.isInitialized = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.isFetching = false;
      state.adminUserList = action.payload.adminUserList;
    },
    failureGet(state) {
      state.isFetching = false;
    },
  },
});

export const actions = adminUserListSlice.actions;

export const reducer = adminUserListSlice.reducer;
