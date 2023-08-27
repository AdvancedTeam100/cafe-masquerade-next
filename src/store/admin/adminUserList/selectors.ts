import { createSelector } from 'reselect';
import { Store } from '@/store';
import { AdminUserListState } from './index';

export const state = createSelector(
  (state: Store) => state.adminAdminUserList,
  (adminUserList: AdminUserListState) => adminUserList,
);
