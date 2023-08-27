import { CastImage } from '@/libs/models/castImage';
import { castDocument } from './cast';
import {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
} from '.';

export const castImageCollection = (castId: string): CollectionReference =>
  castDocument(castId).collection('castImages');

export const castImageDocument = (
  castId: string,
  castImageId: string,
): DocumentReference => castImageCollection(castId).doc(castImageId);

export const castImageConverter: FirestoreDataConverter<CastImage> = {
  toFirestore(castImage: CastImage) {
    return castImage;
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      imageUrl: data.imageUrl,
    };
  },
};
