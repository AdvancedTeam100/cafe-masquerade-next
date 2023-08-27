import { User, UserRole } from '@/libs/models/user';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserListState } from './index';

type SuccessGet = {
  userList: User[];
};

type RequestUpdateRole = {
  uid: string;
};

type SuccessUpdateRole = {
  uid: string;
  role: UserRole;
};

type FailureUpdateRole = {
  uid: string;
};

const initialState: UserListState = {
  isInitialized: false,
  isFetching: false,
  updatingUserIds: [],
  userList: [],
};

const userListSlice = createSlice({
  name: 'admin/userList',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
      state.isInitialized = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.isFetching = false;
      state.userList = action.payload.userList;
    },
    failureGet(state) {
      state.isFetching = false;
    },
    requestUpdateRole(state, action: PayloadAction<RequestUpdateRole>) {
      state.updatingUserIds = [...state.updatingUserIds, action.payload.uid];
    },
    successUpdateRole(state, action: PayloadAction<SuccessUpdateRole>) {
      state.updatingUserIds = state.updatingUserIds.filter(
        (id) => id !== action.payload.uid,
      );
      state.userList = state.userList.map((user) => {
        if (user.uid === action.payload.uid) {
          user.role = action.payload.role;
        }
        return user;
      });
    },
    failureUpdateRole(state, action: PayloadAction<FailureUpdateRole>) {
      state.updatingUserIds = state.updatingUserIds.filter(
        (id) => id !== action.payload.uid,
      );
    },
  },
});

export const actions = userListSlice.actions;

export const reducer = userListSlice.reducer;
