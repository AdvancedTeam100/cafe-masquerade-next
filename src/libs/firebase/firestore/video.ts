import { Video } from '@/libs/models/video';
import firestore, {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
  FirestoreTimestamp,
} from '.';

export const videoCollection = (): CollectionReference =>
  firestore.collection('videos');

export const videoDocument = (videoId: string): DocumentReference =>
  videoCollection().doc(videoId);

export const videoConverter: FirestoreDataConverter<Video> = {
  toFirestore(video: Video) {
    return {
      ...video,
      publishedAt: new Date(video.publishedAt),
      createdAt: new Date(video.createdAt),
      updatedAt: new Date(video.updatedAt),
      finishedAt: video.finishedAt ? new Date(video.finishedAt) : null,
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      ...data,
      publishedAt: data.publishedAt.toDate().toISOString(),
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
      finishedAt: data.finishedAt
        ? data.finishedAt.toDate().toISOString()
        : null,
    } as Video;
  },
};

export type FirestoreVideo = Omit<
  Video,
  'publishedAt' | 'createdAt' | 'updatedAt'
> & {
  publishedAt: FirestoreTimestamp;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
};
