import { Cast, CastStatus } from '@/libs/models/cast';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CastListState } from './index';

type SuccessGet = {
  castList: Cast[];
};

type SetLoadingCastId = {
  castId: string;
};

type UpdateCastItemStatus = {
  castId: string;
  status: CastStatus;
};

type RemoveCastItem = {
  castId: string;
};

const initialState: CastListState = {
  isInitialized: false,
  isFetching: false,
  loadingCastId: '',
  castList: [],
};

const castListSlice = createSlice({
  name: 'admin/castList',
  initialState,
  reducers: {
    requestGet(state) {
      state.isFetching = true;
      state.isInitialized = true;
    },
    successGet(state, action: PayloadAction<SuccessGet>) {
      state.isFetching = false;
      state.castList = action.payload.castList;
    },
    failureGet(state) {
      state.isFetching = false;
    },
    setLoadingCastId(state, action: PayloadAction<SetLoadingCastId>) {
      state.loadingCastId = action.payload.castId;
    },
    updateCastItemStatus(state, action: PayloadAction<UpdateCastItemStatus>) {
      state.castList = state.castList.map((cast) => {
        if (cast.id === action.payload.castId) {
          return {
            ...cast,
            status: action.payload.status,
          };
        } else {
          return cast;
        }
      });
    },
    removeCastItem(state, action: PayloadAction<RemoveCastItem>) {
      state.castList = state.castList.filter(
        (cast) => cast.id !== action.payload.castId,
      );
    },
  },
});

export const actions = castListSlice.actions;

export const reducer = castListSlice.reducer;
