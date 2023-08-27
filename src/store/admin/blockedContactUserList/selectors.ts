import { createSelector } from 'reselect';
import { Store } from '@/store';
import { BlockedContactUserListState } from './index';

export const state = createSelector(
  (state: Store) => state.adminBlockedContactUserList,
  (blockedContactUserListList: BlockedContactUserListState) =>
    blockedContactUserListList,
);
