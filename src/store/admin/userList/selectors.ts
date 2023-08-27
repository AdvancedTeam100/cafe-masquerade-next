import { createSelector } from 'reselect';
import { Store } from '@/store';
import { UserListState } from './index';

export const state = createSelector(
  (state: Store) => state.adminUserList,
  (userList: UserListState) => userList,
);
