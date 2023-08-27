import { CalendarEvent } from '@/libs/models/calendarEvent';
import { castDocument } from './cast';
import {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
} from '.';

export const calendarEventCollection = (castId: string): CollectionReference =>
  castDocument(castId).collection('calendarEvents');

export const calendarEventDocument = (
  castId: string,
  calendarEventId: string,
): DocumentReference => calendarEventCollection(castId).doc(calendarEventId);

export const calendarEventConverter: FirestoreDataConverter<CalendarEvent> = {
  toFirestore(calendarEvent: CalendarEvent) {
    return {
      ...calendarEvent,
      startAt: new Date(calendarEvent.startAt),
      endAt: new Date(calendarEvent.endAt),
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      ...data,
      startAt: data.startAt.toDate().toISOString(),
      endAt: data.endAt.toDate().toISOString(),
    } as CalendarEvent;
  },
};
