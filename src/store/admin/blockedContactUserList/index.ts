import { BlockedContactUser } from '@/libs/models/blockedContactUser';
import {
  actions as blockedContactUserListActions,
  reducer as blockedContactUserListReducer,
} from './slice';
import * as blockedContactUserListOperations from './operations';
import * as blockedContactUserListSelectors from './selectors';

export type BlockedContactUserListState = {
  isInitialized: boolean;
  isFetching: boolean;
  blockedContactUserList: ReadonlyArray<BlockedContactUser>;
};

export {
  blockedContactUserListActions,
  blockedContactUserListReducer,
  blockedContactUserListOperations,
  blockedContactUserListSelectors,
};
