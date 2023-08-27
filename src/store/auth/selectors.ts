import { createSelector } from 'reselect';
import { Store } from '@/store';
import { AuthState } from './index';

export const state = createSelector(
  (state: Store) => state.auth,
  (auth: AuthState) => auth,
);
