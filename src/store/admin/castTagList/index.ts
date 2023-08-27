import { CastTag } from '@/libs/models/castTag';
import {
  actions as castTagListActions,
  reducer as castTagListReducer,
} from './slice';
import * as castTagListOperations from './operations';
import * as castTagListSelectors from './selectors';

export type CastTagListState = {
  isFetching: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  castTags: ReadonlyArray<CastTag>;
};

export {
  castTagListActions,
  castTagListReducer,
  castTagListOperations,
  castTagListSelectors,
};
