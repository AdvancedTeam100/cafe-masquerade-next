import { BlockedContactUser } from '@/libs/models/blockedContactUser';
import firestore, {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
} from '.';

export const blockedContactUsersCollection = (): CollectionReference =>
  firestore.collection('blockedContactUsers');

export const blockedContactUserDocument = (
  blockedContactUserId: string,
): DocumentReference =>
  blockedContactUsersCollection().doc(blockedContactUserId);

export const blockedContactUserConverter: FirestoreDataConverter<BlockedContactUser> = {
  toFirestore(blockedContactUser: BlockedContactUser) {
    return {
      ...blockedContactUser,
      blockedAt: new Date(blockedContactUser.blockedAt),
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      blockedAt: data.blockedAt.toDate().toISOString(),
      email: data.email,
      id: snapshot.id,
    };
  },
};
