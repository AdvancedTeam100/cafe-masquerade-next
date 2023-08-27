import { Livestreaming } from '@/libs/models/livestreaming';
import firestore, {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
} from '.';

export const livestreamingCollection = (): CollectionReference =>
  firestore.collection('livestreamings');

export const livestreamingDocument = (
  livestreamingId: string,
): DocumentReference => livestreamingCollection().doc(livestreamingId);

export const livestreamingConverter: FirestoreDataConverter<Livestreaming> = {
  toFirestore(livestreaming: Livestreaming) {
    return {
      ...livestreaming,
      publishedAt: new Date(livestreaming.publishedAt),
      createdAt: new Date(livestreaming.createdAt),
      updatedAt: new Date(livestreaming.updatedAt),
      startRecordAt: livestreaming.startRecordAt
        ? new Date(livestreaming.startRecordAt)
        : null,
      finishedAt: livestreaming.finishedAt
        ? new Date(livestreaming.finishedAt)
        : null,
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      ...data,
      requiredRole: data.requiredRole ?? 'normal',
      shouldStartRecording: data.shouldStartRecording ?? false,
      publishedAt: data.publishedAt.toDate().toISOString(),
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
      startRecordAt: data?.startRecordAt
        ? data.startRecordAt.toDate().toISOString()
        : null,
      finishedAt: data?.finishedAt
        ? data.finishedAt.toDate().toISOString()
        : null,
    } as Livestreaming;
  },
};
