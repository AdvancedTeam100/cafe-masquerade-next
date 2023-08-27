import { AboutContentState, aboutContentReducer } from './aboutContent';
import { AdminUserState, adminUserReducer } from './adminUser';
import { AdminUserListState, adminUserListReducer } from './adminUserList';
import {
  BlockedContactUserState,
  blockedContactUserReducer,
} from './blockedContactUser';
import {
  BlockedContactUserListState,
  blockedContactUserListReducer,
} from './blockedContactUserList';
import { CastState, castReducer } from './cast';
import { CastListState, castListReducer } from './castList';
import { CastTagListState, castTagListReducer } from './castTagList';
import { HomeContentState, homeContentReducer } from './homeContent';
import { LivestreamingState, livestreamingReducer } from './livestreaming';
import {
  LivestreamingListState,
  livestreamingListReducer,
} from './livestreamingList';
import {
  LivestreamingSlotListState,
  livestreamingSlotListReducer,
} from './livestreamingSlotList';
import { NewsState, newsReducer } from './news';
import { NewsListState, newsListReducer } from './newsList';
import { NewsTagListState, newsTagListReducer } from './newsTagList';
import { UserListState, userListReducer } from './userList';
import { VideoState, videoReducer } from './video';
import { VideoListState, videoListReducer } from './videoList';

export type AdminStore = {
  adminAboutContent: AboutContentState;
  adminAdminUser: AdminUserState;
  adminAdminUserList: AdminUserListState;
  adminBlockedContactUser: BlockedContactUserState;
  adminBlockedContactUserList: BlockedContactUserListState;
  adminCast: CastState;
  adminCastList: CastListState;
  adminCastTagList: CastTagListState;
  adminHomeContent: HomeContentState;
  adminLivestreaming: LivestreamingState;
  adminLivestreamingList: LivestreamingListState;
  adminLivestreamingSlotList: LivestreamingSlotListState;
  adminNews: NewsState;
  adminNewsList: NewsListState;
  adminNewsTagList: NewsTagListState;
  adminUserList: UserListState;
  adminVideo: VideoState;
  adminVideoList: VideoListState;
};

export const adminReducers = {
  adminAboutContent: aboutContentReducer,
  adminAdminUser: adminUserReducer,
  adminAdminUserList: adminUserListReducer,
  adminBlockedContactUser: blockedContactUserReducer,
  adminBlockedContactUserList: blockedContactUserListReducer,
  adminCast: castReducer,
  adminCastList: castListReducer,
  adminCastTagList: castTagListReducer,
  adminHomeContent: homeContentReducer,
  adminLivestreaming: livestreamingReducer,
  adminLivestreamingList: livestreamingListReducer,
  adminLivestreamingSlotList: livestreamingSlotListReducer,
  adminNews: newsReducer,
  adminNewsList: newsListReducer,
  adminNewsTagList: newsTagListReducer,
  adminUserList: userListReducer,
  adminVideo: videoReducer,
  adminVideoList: videoListReducer,
};
