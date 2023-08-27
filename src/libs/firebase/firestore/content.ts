import { AboutContent, ContentId, HomeContent } from '@/libs/models/content';
import firestore, {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
} from '.';

export const contentCollection = (): CollectionReference =>
  firestore.collection('contents');

export const contentDocument = (contentId: ContentId): DocumentReference =>
  contentCollection().doc(contentId);

export const homeConverter: FirestoreDataConverter<HomeContent> = {
  toFirestore(home: HomeContent) {
    return {
      ...home,
      updatedAt: new Date(home.updatedAt),
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      ...data,
      updatedAt: data.updatedAt.toDate().toISOString(),
    } as HomeContent;
  },
};
export const aboutConverter: FirestoreDataConverter<AboutContent> = {
  toFirestore(about: AboutContent) {
    return {
      ...about,
      updatedAt: new Date(about.updatedAt),
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      ...data,
      updatedAt: data.updatedAt.toDate().toISOString(),
    } as AboutContent;
  },
};
