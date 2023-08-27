import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PathHistory, RouterState } from './index';

type AddPathHistory = {
  pathHistory: PathHistory;
};

const initialState: RouterState = {
  pathHistories: [],
};

const routerSlice = createSlice({
  name: 'router',
  initialState,
  reducers: {
    addHistory(state, { payload }: PayloadAction<AddPathHistory>) {
      state.pathHistories = [...state.pathHistories, payload.pathHistory];
    },
  },
});

export const actions = routerSlice.actions;

export const reducer = routerSlice.reducer;
