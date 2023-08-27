import { BlockedContactUser } from '@/libs/models/blockedContactUser';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { BlockedContactUserListState } from './index';

type SuccessGet = {
  blockedContactUserList: BlockedContactUser[];
};

type RemoveBlockedContactUserItem = {
  blockedContactUserId: string;
};

const initialState: BlockedContactUserListState = {
  isInitialized: false,
  isFetching: false,
  blockedContactUserList: [],
};

const blockedContactUserListSlice = createSlice({
  name: 'admin/blockedContactUserList',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
      state.isInitialized = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.isFetching = false;
      state.blockedContactUserList = action.payload.blockedContactUserList;
    },
    failureGet(state) {
      state.isFetching = false;
    },
    removeBlockedContactUserItem(
      state,
      action: PayloadAction<RemoveBlockedContactUserItem>,
    ) {
      state.blockedContactUserList = state.blockedContactUserList.filter(
        (blockedContactuser) =>
          blockedContactuser.id !== action.payload.blockedContactUserId,
      );
    },
  },
});

export const actions = blockedContactUserListSlice.actions;

export const reducer = blockedContactUserListSlice.reducer;
