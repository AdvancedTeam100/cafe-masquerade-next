import { BlockedContactUser } from '@/libs/models/blockedContactUser';
import {
  actions as blockedContactUserActions,
  reducer as blockedContactUserReducer,
} from './slice';
import * as blockedContactUserOperations from './operations';
import * as blockedContactUserSelectors from './selectors';

export type BlockedContactUserState = {
  isFetching: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  blockedContactUser: BlockedContactUser | null;
};

export type BlockedContactUserCreateParams = {
  email: string;
};

export {
  blockedContactUserActions,
  blockedContactUserReducer,
  blockedContactUserOperations,
  blockedContactUserSelectors,
};
