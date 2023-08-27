import { News, NewsStatus } from '@/libs/models/news';
import { actions as newsActions, reducer as newsReducer } from './slice';
import * as newsOperations from './operations';
import * as newsSelectors from './selectors';

export type NewsState = {
  isFetching: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  news: News | null;
};

export type NewsParams = {
  title: string;
  description: string;
  content: string;
  status: NewsStatus;
  publishedAt: string;
  image: File;
  createdUserId: string;
  updatedUserId: string;
  tags: string[];
};

export type NewsCreateParams = Omit<NewsParams, 'updatedUserId'>;
export type NewsUpdateParams = Omit<NewsParams, 'image'> & {
  image: File | null;
  imageUrl: string;
};

export { newsActions, newsReducer, newsOperations, newsSelectors };
