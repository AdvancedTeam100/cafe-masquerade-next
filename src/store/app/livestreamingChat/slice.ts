import { LivestreamingMessage } from '@/libs/models/livestreamingMessage';
import { removeDuplicateItem } from '@/libs/utils/array';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LivestreamingChatState } from '.';

type SetNewMessages = {
  messages: LivestreamingMessage[];
};

type RemoveMessage = {
  id: string;
};

type SetLivestreamingId = {
  livestreamingId: string;
};

type DeleteMessage = {
  id: string;
};

type UpdateMessage = {
  id: string;
};

type SetHasEndReached = {
  hasEndReached: boolean;
};

const initialState: LivestreamingChatState = {
  livestreamingId: null,
  byId: {},
  listIds: [],
  unreadIds: [],
  fixedIds: [],
  isCreating: false,
  updatingMessageids: [],
  deletingMessageIds: [],
  hasEndReached: true,
};

const videoSlice = createSlice({
  name: 'app/livestreamingChat',
  initialState,
  reducers: {
    setNewMessages(state, action: PayloadAction<SetNewMessages>) {
      const { messages } = action.payload;
      let fixedIds = state.fixedIds;
      messages.forEach((message) => {
        if (fixedIds.includes(message.id) && !message.isFixed) {
          fixedIds = fixedIds.filter((id) => id !== message.id);
        } else if (message.isFixed) {
          fixedIds = [...fixedIds, message.id];
        }
      });
      state.byId = messages.reduce(
        (obj, message) => ({ ...obj, [message.id]: message }),
        state.byId,
      );
      state.fixedIds = fixedIds;
      if (state.hasEndReached) {
        state.listIds = removeDuplicateItem([
          ...state.listIds,
          ...messages.map((message) => message.id),
        ]).slice(-100);
        state.unreadIds = [];
      } else {
        state.unreadIds = removeDuplicateItem([
          ...state.unreadIds,
          ...messages.map((message) => message.id),
        ]).slice(-100);
      }
    },
    listAllUnreadMessages(state) {
      state.listIds = removeDuplicateItem([
        ...state.listIds,
        ...state.unreadIds,
      ]);
      state.unreadIds = [];
    },
    removeMessage(state, action: PayloadAction<RemoveMessage>) {
      const removedId = action.payload.id;
      state.listIds = state.listIds.filter((id) => id !== removedId);
      state.unreadIds = state.unreadIds.filter((id) => id !== removedId);
    },
    setLivestreamingId(state, action: PayloadAction<SetLivestreamingId>) {
      state.livestreamingId = action.payload.livestreamingId;
    },
    requestCreateMessage(state) {
      state.isCreating = true;
    },
    successCreateMessage(state) {
      state.isCreating = false;
    },
    failureCreateMessage(state) {
      state.isCreating = false;
    },
    requestUpdateMessage(state, action: PayloadAction<UpdateMessage>) {
      state.deletingMessageIds = [
        ...state.deletingMessageIds,
        action.payload.id,
      ];
    },
    successUpdateMessage(state, action: PayloadAction<UpdateMessage>) {
      state.deletingMessageIds = state.deletingMessageIds.filter(
        (id) => id !== action.payload.id,
      );
    },
    failureUpdateMessage(state, action: PayloadAction<UpdateMessage>) {
      state.deletingMessageIds = state.deletingMessageIds.filter(
        (id) => id !== action.payload.id,
      );
    },
    requestDeleteMessage(state, action: PayloadAction<DeleteMessage>) {
      state.deletingMessageIds = [
        ...state.deletingMessageIds,
        action.payload.id,
      ];
    },
    successDeleteMessage(state, action: PayloadAction<DeleteMessage>) {
      state.deletingMessageIds = state.deletingMessageIds.filter(
        (id) => id !== action.payload.id,
      );
    },
    failureDeleteMessage(state, action: PayloadAction<DeleteMessage>) {
      state.deletingMessageIds = state.deletingMessageIds.filter(
        (id) => id !== action.payload.id,
      );
    },
    setHasEndReached(state, action: PayloadAction<SetHasEndReached>) {
      state.hasEndReached = action.payload.hasEndReached;
    },
    resetState() {
      return initialState;
    },
  },
});

export const actions = videoSlice.actions;

export const reducer = videoSlice.reducer;
