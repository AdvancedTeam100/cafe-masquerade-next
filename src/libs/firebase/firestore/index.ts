import 'firebase/firestore';
import firebase from '@/libs/firebase';

const firestore = firebase.firestore();

export type CollectionReference = firebase.firestore.CollectionReference;
export type DocumentReference = firebase.firestore.DocumentReference;
export type FirestoreDataConverter<
  T
> = firebase.firestore.FirestoreDataConverter<T>;
export type Query = firebase.firestore.Query;
export type QuerySnapShot<T> = firebase.firestore.QuerySnapshot<T>;
export type FirestoreTimestamp = firebase.firestore.Timestamp;

export default firestore;
