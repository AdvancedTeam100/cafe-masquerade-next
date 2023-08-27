import { Cast } from '@/libs/models/cast';
import firestore, {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
} from '.';

export const castCollection = (): CollectionReference =>
  firestore.collection('casts');

export const castDocument = (castId: string): DocumentReference =>
  castCollection().doc(castId);

export const castConverter: FirestoreDataConverter<Cast> = {
  toFirestore(cast: Cast) {
    return {
      ...cast,
      joinedAt: new Date(cast.joinedAt),
      createdAt: new Date(cast.createdAt),
      updatedAt: new Date(cast.updatedAt),
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data.name,
      description: data.description,
      livestreamingDescription: data.livestreamingDescription ?? null,
      selfIntroduction: data.selfIntroduction,
      physicalInformation: data.physicalInformation,
      imageUrl: data.imageUrl,
      status: data.status,
      tags: data.tags,
      youtubeChannelId: data.youtubeChannelId,
      youtubeChannelIdSecond: data?.youtubeChannelIdSecond ?? null,
      socialId: {
        twitter: data.socialId.twitter,
        twitcasting: data.socialId?.twitcasting ?? null,
        tiktok: data.socialId?.tiktok ?? null,
        niconico: data.socialId?.niconico ?? null,
      },
      notificationDiscordUrl: data.notificationDiscordUrl ?? null,
      qa: data.qa,
      joinedAt: data.joinedAt.toDate().toISOString(),
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
    };
  },
};
