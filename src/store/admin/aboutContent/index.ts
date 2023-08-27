import { AboutContent } from '@/libs/models/content';
import {
  actions as aboutContentActions,
  reducer as aboutContentReducer,
} from './slice';
import * as aboutContentOperations from './operations';
import * as aboutContentSelectors from './selectors';

export type AboutContentState = {
  isFetching: boolean;
  isUpdating: boolean;
  aboutContent: AboutContent | null;
};

export type AboutContentParams = Omit<AboutContent, 'updatedAt'>;

export {
  aboutContentActions,
  aboutContentReducer,
  aboutContentOperations,
  aboutContentSelectors,
};
