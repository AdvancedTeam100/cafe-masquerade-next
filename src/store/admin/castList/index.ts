import { Cast } from '@/libs/models/cast';
import {
  actions as castListActions,
  reducer as castListReducer,
} from './slice';
import * as castListOperations from './operations';
import * as castListSelectors from './selectors';

export type CastListState = {
  isInitialized: boolean;
  isFetching: boolean;
  loadingCastId: string;
  castList: ReadonlyArray<Cast>;
};

export {
  castListActions,
  castListReducer,
  castListOperations,
  castListSelectors,
};
