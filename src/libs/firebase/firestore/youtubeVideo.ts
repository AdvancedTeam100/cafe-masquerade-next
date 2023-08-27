import { LiveBroadcastContent, YoutubeVideo } from '@/libs/models/youtubeVideo';
import { castDocument } from './cast';
import {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
} from '.';

export const youtubeVideoCollection = (castId: string): CollectionReference =>
  castDocument(castId).collection('youtubeVideos');

export const youtubeVideoDocument = (
  castId: string,
  youtubeVideoId: string,
): DocumentReference => youtubeVideoCollection(castId).doc(youtubeVideoId);

export const youtubeVideoConverter: FirestoreDataConverter<YoutubeVideo> = {
  toFirestore(youtubeVideo: YoutubeVideo) {
    return {
      ...youtubeVideo,
      startAt: new Date(youtubeVideo.startAt),
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      ...data,
      startAt: data.startAt.toDate().toISOString(),
    } as YoutubeVideo;
  },
};

export const getCastYoutubeVideos = async (castId: string) => {
  const youtubeVideoQuerySnap = await youtubeVideoCollection(castId)
    .withConverter(youtubeVideoConverter)
    .where('liveBroadcastContent', '==', LiveBroadcastContent.None)
    .orderBy('startAt', 'desc')
    .limit(5)
    .get();
  return youtubeVideoQuerySnap.docs.map((doc) => doc.data());
};
