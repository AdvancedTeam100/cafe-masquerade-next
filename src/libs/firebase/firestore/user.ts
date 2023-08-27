import { User } from '@/libs/models/user';
import firestore, {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
} from '.';

export const userCollection = (): CollectionReference =>
  firestore.collection('users');

export const userDocument = (userId: string): DocumentReference =>
  userCollection().doc(userId);

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User) {
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      ...data,
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
    } as User;
  },
};
