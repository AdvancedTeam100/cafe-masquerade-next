import { Video } from '@/libs/models/video';
import { removeDuplicateItem } from '@/libs/utils/array';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { VideoFilter, VideoState } from './index';

type SuccessGetList = {
  videos: Video[];
};

type SetVideo = {
  video: Video;
};

type SetTargetVideoId = {
  targetVideoId: string;
};

type UpdateFilter = {
  filter: VideoFilter;
};

const initialState: VideoState = {
  isFetchingVideo: false,
  targetVideoId: null,
  isFetchingList: false,
  isInitialized: false,
  byId: {},
  listIds: [],
  filter: {
    orderBy: 'desc',
    castId: '',
    display: 'all',
    videoType: 'all',
  },
};

const videoSlice = createSlice({
  name: 'app/video',
  initialState,
  reducers: {
    setVideo(state, action: PayloadAction<SetVideo>) {
      const video = action.payload.video;
      state.byId = { ...state.byId, [video.id]: video };
    },
    setTargetVideoId(state, action: PayloadAction<SetTargetVideoId>) {
      state.targetVideoId = action.payload.targetVideoId;
    },
    requestGetList(state) {
      state.isFetchingList = true;
    },
    successGetList(state, action: PayloadAction<SuccessGetList>) {
      const videos = action.payload.videos;
      const listIds = [...state.listIds, ...videos.map((video) => video.id)];

      state.isFetchingList = false;
      state.byId = videos.reduce(
        (obj, video) => ({ ...obj, [video.id]: video }),
        state.byId,
      );
      state.listIds = removeDuplicateItem(listIds);
      state.isInitialized = true;
    },
    failureGetList(state) {
      state.isFetchingList = false;
      state.isInitialized = true;
    },
    updateFilter(state, action: PayloadAction<UpdateFilter>) {
      state.listIds = [];
      state.filter = action.payload.filter;
    },
    resetListIds(state) {
      state.listIds = [];
      state.isInitialized = false;
    },
  },
});

export const actions = videoSlice.actions;

export const reducer = videoSlice.reducer;
