import { User } from '@/libs/models/user';
import {
  actions as userListActions,
  reducer as userListReducer,
} from './slice';
import * as userListOperations from './operations';
import * as userListSelectors from './selectors';

export type UserListState = {
  isInitialized: boolean;
  isFetching: boolean;
  userList: ReadonlyArray<User>;
  updatingUserIds: string[];
};

export {
  userListActions,
  userListReducer,
  userListOperations,
  userListSelectors,
};
