import { actions as routerActions, reducer as routerReducer } from './slice';
import * as routerSelectors from './selectors';

export type PathHistory = {
  asPath: string;
  pathname: string;
};

export type RouterState = {
  pathHistories: PathHistory[];
};

export { routerActions, routerReducer, routerSelectors };
