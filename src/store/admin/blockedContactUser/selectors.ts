import { createSelector } from 'reselect';
import { Store } from '@/store';
import { BlockedContactUserState } from './index';

export const state = createSelector(
  (state: Store) => state.adminBlockedContactUser,
  (blockedUser: BlockedContactUserState) => blockedUser,
);
