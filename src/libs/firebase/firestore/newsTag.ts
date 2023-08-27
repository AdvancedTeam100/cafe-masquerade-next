import { News, NewsStatus } from '@/libs/models/news';
import { NewsTag } from '@/libs/models/newsTag';
import { newsCollection, newsConverter } from './news';
import firestore, {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
  QuerySnapShot,
} from '.';

export const newsTagCollection = (): CollectionReference =>
  firestore.collection('newsTags');

export const newsTagDocument = (newsTagId: string): DocumentReference =>
  newsTagCollection().doc(newsTagId);

export const newsTagConverter: FirestoreDataConverter<NewsTag> = {
  toFirestore(newsTag: NewsTag) {
    return {
      ...newsTag,
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      name: data.name,
    };
  },
};

export const getPublishedNewsTags = async (
  querySnapShot?: QuerySnapShot<News>,
): Promise<NewsTag[]> => {
  let newsQuerySnap = querySnapShot;
  if (!newsQuerySnap) {
    newsQuerySnap = await newsCollection()
      .withConverter(newsConverter)
      .where('status', '==', NewsStatus.Published)
      .where('publishedAt', '<=', new Date())
      .orderBy('publishedAt', 'desc')
      .get();
  }

  const newsTagList = newsQuerySnap.docs.reduce((acc, crr) => {
    const news = crr.data();
    return [...acc, ...news.tags];
  }, [] as string[]);
  return Array.from(new Set(newsTagList)).map((tag) => ({
    name: tag,
  }));
};
