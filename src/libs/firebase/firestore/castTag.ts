import { CastTag } from '@/libs/models/castTag';
import firestore, {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
} from '.';

export const castTagCollection = (): CollectionReference =>
  firestore.collection('castTags');

export const castTagDocument = (castTagId: string): DocumentReference =>
  castTagCollection().doc(castTagId);

export const castTagConverter: FirestoreDataConverter<CastTag> = {
  toFirestore(castTag: CastTag) {
    return {
      ...castTag,
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      name: data.name,
    };
  },
};
