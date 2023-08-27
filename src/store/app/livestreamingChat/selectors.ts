import { createSelector } from 'reselect';
import { Store } from '@/store';
import { notNullOrUndefined } from '@/libs/utils/array';
import { AuthState } from '@/store/auth';
import { isAdmin } from '@/libs/models/adminUser';
import { LivestreamingMessage } from '@/libs/models/livestreamingMessage';
import { LivestreamingChatState } from './index';

export const state = createSelector(
  (state: Store) => state.appLivestreamingChat,
  (livestreamingChat: LivestreamingChatState) => livestreamingChat,
);

export const messages = createSelector(
  [(state: Store) => state.appLivestreamingChat],
  ({ listIds, byId, fixedIds }: LivestreamingChatState) => {
    const messages = listIds
      .map((id) => byId[id])
      .filter(notNullOrUndefined)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const fixedId = fixedIds[fixedIds.length - 1];
    const fixedMessage = fixedId ? byId[fixedId] : undefined;
    return {
      messages,
      fixedMessage,
    };
  },
);

export const userInfo = createSelector(
  [(state: Store) => state.auth],
  ({ user }: AuthState): LivestreamingMessage['user'] | null => {
    if (!user) return null;
    if (isAdmin(user.role) && 'publicDisplayName' in user) {
      return {
        name: user.publicDisplayName,
        avatarUrl: user.publicAvatarUrl,
        castId: user.castId ?? null,
        isAdmin: true,
      };
    } else {
      return {
        name: user.displayName,
        avatarUrl: user.avatarUrl,
        userId: user.uid,
      };
    }
  },
);
