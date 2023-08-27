import { createSlice } from '@reduxjs/toolkit';
import { AdminUserState } from './index';

const initialState: AdminUserState = {
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
};

const adminUserSlice = createSlice({
  name: 'admin/adminUser',
  initialState,
  reducers: {
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

export const actions = adminUserSlice.actions;

export const reducer = adminUserSlice.reducer;
