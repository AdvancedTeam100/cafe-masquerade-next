import { HomeContent } from '@/libs/models/content';
import {
  actions as homeContentActions,
  reducer as homeContentReducer,
} from './slice';
import * as homeContentOperations from './operations';
import * as homeContentSelectors from './selectors';

export type HomeContentState = {
  isFetching: boolean;
  isUpdating: boolean;
  homeContent: HomeContent | null;
};

export type HomeContentParams = Omit<
  HomeContent,
  'topImages' | 'updatedAt' | 'reviewTweetIds'
> & {
  topImages: Array<
    { file: File; href: string } | { url: string; href: string }
  >;
};

export {
  homeContentActions,
  homeContentReducer,
  homeContentOperations,
  homeContentSelectors,
};
