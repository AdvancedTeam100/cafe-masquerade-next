import { AdminUser } from '@/libs/models/adminUser';
import { User } from '@/libs/models/user';
import { actions as authActions, reducer as authReducer } from './slice';
import * as authOperations from './operations';
import * as authSelectors from './selectors';

export type AuthUser = User | AdminUser;

export type AuthState = {
  isInitialized: boolean;
  isFetching: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  user: AuthUser | null;
  idToken: string | null;
  errorCode: string;
};

export type AuthUserParams = Pick<
  AuthUser,
  'displayName' | 'email' | 'dateOfBirth' | 'sex' | 'prefecture'
> & {
  avatar: File;
};

export { authActions, authReducer, authOperations, authSelectors };
