import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthState, AuthUser } from './index';

type SuccessAuth = {
  user: AuthUser;
  token: string;
};

type SuccessUpdate = {
  user: AuthUser;
};

type FailureAuth = {
  errorCode?: string;
};

const initialState: AuthState = {
  isInitialized: false,
  isFetching: false,
  isUpdating: false,
  isDeleting: false,
  user: null,
  idToken: null,
  errorCode: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    requestAuth(state) {
      state.isFetching = true;
      state.errorCode = '';
    },
    successAuth(state, action: PayloadAction<SuccessAuth>) {
      state.user = action.payload.user;
      state.idToken = action.payload.token;
      state.isFetching = false;
      state.isInitialized = true;
      state.errorCode = '';
    },
    successResetAuth(state) {
      state.isFetching = false;
      state.isInitialized = false;
      state.user = null;
      state.errorCode = '';
    },
    failureAuth(state, action: PayloadAction<FailureAuth>) {
      state.isFetching = false;
      state.isInitialized = true;
      state.errorCode = action.payload.errorCode
        ? action.payload.errorCode
        : '';
    },
    requestUpdate(state) {
      state.isUpdating = true;
    },
    successUpdate(state, action: PayloadAction<SuccessUpdate>) {
      state.user = action.payload.user;
      state.isUpdating = false;
    },
    failureUpdate(state) {
      state.isUpdating = false;
    },
    requestDelete(state) {
      state.isDeleting = true;
    },
    successDelete(state) {
      state.isInitialized = false;
      state.user = null;
      state.isDeleting = false;
    },
    failureDelete(state) {
      state.isDeleting = false;
    },
  },
});

export const actions = authSlice.actions;

export const reducer = authSlice.reducer;
