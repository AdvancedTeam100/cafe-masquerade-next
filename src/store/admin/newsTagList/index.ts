import { NewsTag } from '@/libs/models/newsTag';
import {
  actions as newsTagListActions,
  reducer as newsTagListReducer,
} from './slice';
import * as newsTagListOperations from './operations';
import * as newsTagListSelectors from './selectors';

export type NewsTagListState = {
  isFetching: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  newsTags: ReadonlyArray<NewsTag>;
};

export {
  newsTagListActions,
  newsTagListReducer,
  newsTagListOperations,
  newsTagListSelectors,
};
