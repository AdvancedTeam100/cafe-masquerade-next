import { LivestreamingMessage } from '@/libs/models/livestreamingMessage';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LivestreamingChatReplayState } from '.';

type SuccessGetMessages = {
  messages: LivestreamingMessage[];
  currentTime: number;
};

type SetLivestreamingInfo = {
  livestreamingId: string;
  startAt: number;
};

type SetCurrentTime = {
  currentTime: number;
};

type SetIds = {
  ids: string[];
};

const initialState: LivestreamingChatReplayState = {
  isFetchingMessages: false,
  isFetchingNewMessages: false,
  livestreamingId: null,
  byId: {},
  startAt: null,
  currentTime: 0,
  lastFetchTime: 0,
  listIds: [],
  unreadIds: [],
};

const videoSlice = createSlice({
  name: 'app/livestreamingChatReplay',
  initialState,
  reducers: {
    requestGetMessages(state) {
      state.isFetchingMessages = true;
    },
    successGetMessages(state, action: PayloadAction<SuccessGetMessages>) {
      const messages = action.payload.messages;
      state.isFetchingMessages = false;
      state.byId = messages.reduce(
        (obj, video) => ({ ...obj, [video.id]: video }),
        {},
      );
      state.lastFetchTime = action.payload.currentTime;
    },
    failureGetMessages(state) {
      state.isFetchingMessages = false;
    },
    requestGetNewMessages(state) {
      state.isFetchingNewMessages = true;
    },
    successGetNewMessages(state, action: PayloadAction<SuccessGetMessages>) {
      const messages = action.payload.messages;
      state.isFetchingNewMessages = false;
      state.byId = messages.reduce(
        (obj, video) => ({ ...obj, [video.id]: video }),
        state.byId,
      );
      state.lastFetchTime = action.payload.currentTime;
    },
    failureGetNewMessages(state) {
      state.isFetchingNewMessages = false;
    },
    setLivestreamingInfo(state, action: PayloadAction<SetLivestreamingInfo>) {
      state.livestreamingId = action.payload.livestreamingId;
      state.startAt = action.payload.startAt;
    },
    setCurrentTime(state, action: PayloadAction<SetCurrentTime>) {
      state.currentTime = action.payload.currentTime;
    },
    setListIds(state, action: PayloadAction<SetIds>) {
      state.listIds = action.payload.ids;
    },
    setUnreadIds(state, action: PayloadAction<SetIds>) {
      state.unreadIds = action.payload.ids;
    },
  },
});

export const actions = videoSlice.actions;

export const reducer = videoSlice.reducer;
