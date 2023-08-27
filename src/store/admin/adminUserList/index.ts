import { AdminUser } from '@/libs/models/adminUser';
import {
  actions as adminUserListActions,
  reducer as adminUserListReducer,
} from './slice';
import * as adminUserListOperations from './operations';
import * as adminUserListSelectors from './selectors';

export type AdminUserListState = {
  isInitialized: boolean;
  isFetching: boolean;
  adminUserList: ReadonlyArray<AdminUser>;
};

export {
  adminUserListActions,
  adminUserListReducer,
  adminUserListOperations,
  adminUserListSelectors,
};
