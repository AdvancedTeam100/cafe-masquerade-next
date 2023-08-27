import { LivestreamingSlot } from '@/libs/models/livestreamingSlot';
import firestore, {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
} from '.';

export const livestreamingSlotCollection = (): CollectionReference =>
  firestore.collection('livestreamingSlots');

export const livestreamingSlotDocument = (
  livestreamingSlotId: string,
): DocumentReference => livestreamingSlotCollection().doc(livestreamingSlotId);

export const livestreamingSlotConverter: FirestoreDataConverter<LivestreamingSlot> = {
  toFirestore(livestreamingSlot: LivestreamingSlot) {
    return {
      ...livestreamingSlot,
      createdAt: new Date(livestreamingSlot.createdAt),
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      ...data,
      createdAt: data.createdAt.toDate().toISOString(),
    } as LivestreamingSlot;
  },
};
