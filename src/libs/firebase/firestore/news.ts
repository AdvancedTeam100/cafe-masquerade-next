import { News, NewsStatus } from '@/libs/models/news';
import firestore, {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
  Query,
} from '.';

export const newsCollection = (): CollectionReference =>
  firestore.collection('news');

export const newsDocument = (newsId: string): DocumentReference =>
  newsCollection().doc(newsId);

export const accessableNewsQuery = (newsId: string): Query =>
  newsCollection()
    .where('id', '==', newsId)
    .where('status', 'in', [NewsStatus.Published, NewsStatus.Limited]);

export const newsConverter: FirestoreDataConverter<News> = {
  toFirestore(news: News) {
    return {
      ...news,
      publishedAt: new Date(news.publishedAt),
      createdAt: new Date(news.createdAt),
      updatedAt: new Date(news.updatedAt),
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data.title,
      description: data.description,
      content: data.content,
      imageUrl: data.imageUrl,
      status: data.status,
      tags: data.tags,
      createdUserId: data.createdUserId,
      updatedUserId: data.updatedUserId,
      publishedAt: data.publishedAt.toDate().toISOString(),
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
    };
  },
};

export const getLatestNews = async (newsCount = 3) => {
  const latestNewsSnap = await newsCollection()
    .withConverter(newsConverter)
    .where('status', '==', NewsStatus.Published)
    .where('publishedAt', '<=', new Date())
    .orderBy('publishedAt', 'desc')
    .limit(newsCount)
    .get();

  return latestNewsSnap.docs.map((doc) => doc.data());
};
