import {
  Action,
  AnyAction,
  Reducer,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import {
  ThunkAction as _ThunkAction,
  ThunkDispatch as _ThunkDispatch,
} from 'redux-thunk';
import { AuthState, authActions, authReducer } from './auth';
import { RouterState, routerReducer } from './router';
import { AdminStore, adminReducers } from './admin';
import { AppStore, appReducers } from './app';

export type ThunkAction<R, A extends Action = AnyAction> = _ThunkAction<
  R,
  Store,
  void,
  A
>;

export type ThunkDispatch<A extends Action = AnyAction> = _ThunkDispatch<
  Store,
  void,
  A
>;

export type Store = AdminStore &
  AppStore & {
    auth: AuthState;
    router: RouterState;
  };

const rootReducer = combineReducers({
  ...adminReducers,
  ...appReducers,
  auth: authReducer,
  router: routerReducer,
});

const reducer: Reducer<Store | undefined, AnyAction> = (
  state: Store | undefined,
  action: AnyAction,
) => {
  if (action.type === authActions.successResetAuth.type) {
    state = undefined;
  }

  return rootReducer(state, action);
};

export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});
