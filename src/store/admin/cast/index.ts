import { Cast } from '@/libs/models/cast';
import { CastImage } from '@/libs/models/castImage';
import { actions as castActions, reducer as castReducer } from './slice';
import * as castOperations from './operations';
import * as castSelectors from './selectors';

export type CastState = {
  isFetching: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  cast: Cast | null;
  castImages: CastImage[];
};

export type CastParams = Omit<Cast, 'createdAt' | 'updatedAt'> & {
  image: File;
  images: Array<File | CastImage>;
};

export { castActions, castReducer, castOperations, castSelectors };
