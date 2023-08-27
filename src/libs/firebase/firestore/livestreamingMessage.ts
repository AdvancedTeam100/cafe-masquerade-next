import { LivestreamingMessage } from '@/libs/models/livestreamingMessage';
import firebase from '@/libs/firebase';
import { notNull } from '@/libs/utils/array';
import { livestreamingDocument } from './livestreaming';
import {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
} from '.';

export const livestreamingMessageCollection = (
  livestreamingId: string,
): CollectionReference =>
  livestreamingDocument(livestreamingId).collection('livestreamingMessages');

export const livestreamingMessageDocument = (
  livestreamingId: string,
  livestreamingMessageId: string,
): DocumentReference =>
  livestreamingMessageCollection(livestreamingId).doc(livestreamingMessageId);

export const livestreamingMessageConverter: FirestoreDataConverter<LivestreamingMessage> = {
  toFirestore(livestreamingMessage: LivestreamingMessage) {
    return {
      ...livestreamingMessage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt.toDate().toISOString(),
    } as LivestreamingMessage;
  },
};

export const livestreamingMessageSubscription = (
  livestreamingId: string,
  onFetch: (messages: LivestreamingMessage[]) => void,
  onRemoved: (messageId: string) => void,
) =>
  livestreamingMessageCollection(livestreamingId)
    .orderBy('createdAt', 'asc')
    .onSnapshot((querySnap) => {
      const newMessages = querySnap
        .docChanges()
        .map((change) => {
          if (change.type === 'added') {
            const doc = change.doc;
            const data = doc.data();
            if (data.createdAt) {
              return livestreamingMessageConverter.fromFirestore(doc, {
                serverTimestamps: 'none',
              });
            }
          }
          if (change.type === 'modified') {
            const doc = change.doc;
            const data = doc.data();
            if (data.createdAt) {
              return livestreamingMessageConverter.fromFirestore(doc, {
                serverTimestamps: 'none',
              });
            }
          }
          if (change.type === 'removed') {
            const messageId = change.doc.id;
            onRemoved(messageId);
          }
          return null;
        })
        .filter(notNull);
      onFetch(newMessages);
    });
