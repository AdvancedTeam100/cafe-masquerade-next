import { createSelector } from 'reselect';
import { Store } from '@/store';
import { AdminUserState } from './index';

export const state = createSelector(
  (state: Store) => state.adminAdminUser,
  (adminUser: AdminUserState) => adminUser,
);
