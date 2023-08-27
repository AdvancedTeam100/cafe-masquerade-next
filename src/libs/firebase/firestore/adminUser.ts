import { AdminUser } from '@/libs/models/adminUser';
import firestore, {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
} from '.';

export const adminUserCollection = (): CollectionReference =>
  firestore.collection('adminUsers');

export const adminUserDocument = (adminUserId: string): DocumentReference =>
  adminUserCollection().doc(adminUserId);

export const adminUserConverter: FirestoreDataConverter<AdminUser> = {
  toFirestore(adminUser: AdminUser) {
    return {
      ...adminUser,
      createdAt: new Date(adminUser.createdAt),
      updatedAt: new Date(adminUser.updatedAt),
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      ...data,
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
    } as AdminUser;
  },
};
