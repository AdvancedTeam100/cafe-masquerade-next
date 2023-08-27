import { News } from '@/libs/models/news';
import {
  actions as newsListActions,
  reducer as newsListReducer,
} from './slice';
import * as newsListOperations from './operations';
import * as newsListSelectors from './selectors';

export type NewsListState = {
  isInitialized: boolean;
  isFetching: boolean;
  loadingNewsId: string;
  newsList: ReadonlyArray<News>;
};

export {
  newsListActions,
  newsListReducer,
  newsListOperations,
  newsListSelectors,
};
