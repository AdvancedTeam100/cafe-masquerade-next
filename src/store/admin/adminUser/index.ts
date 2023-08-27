import { AdminUser } from '@/libs/models/adminUser';
import {
  actions as adminUserActions,
  reducer as adminUserReducer,
} from './slice';
import * as adminUserOperations from './operations';
import * as adminUserSelectors from './selectors';

export type AdminUserState = {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
};

export type AdminUserParams = Pick<
  AdminUser,
  'email' | 'role' | 'castId' | 'publicDisplayName' | 'publicAvatarUrl'
> & {
  publicAvatar: File;
};

export {
  adminUserActions,
  adminUserReducer,
  adminUserOperations,
  adminUserSelectors,
};
