import { CastSchedule } from '@/libs/models/castSchedule';
import {
  Schedule,
  ScheduleType,
  getScheduleTypeDisplayName,
} from '@/libs/models/schedule';
import { notNull } from '@/libs/utils/array';
import {
  getDateWithDay,
  getEndOfNextWeek,
  getNextDaysStr,
  getStartOfDate,
  getTime,
} from '@/libs/utils/dateFormat';
import firestore, {
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
} from '.';

export const scheduleCollection = (): CollectionReference =>
  firestore.collection('schedules');

export const scheduleDocument = (scheduleId: string): DocumentReference =>
  scheduleCollection().doc(scheduleId);

export const scheduleConverter: FirestoreDataConverter<Schedule> = {
  toFirestore(schedule: Schedule) {
    return {
      ...schedule,
      startAt: new Date(schedule.startAt),
      endAt: new Date(schedule.endAt),
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      ...data,
      startAt: data.startAt.toDate().toISOString(),
      endAt: data.endAt.toDate().toISOString(),
    } as Schedule;
  },
};

export const getCastSchedules = async (castId: string) => {
  const scheduleQuerySnap = await scheduleCollection()
    .withConverter(scheduleConverter)
    .where('castId', '==', castId)
    .where('startAt', '>', getStartOfDate())
    .where('startAt', '<', getEndOfNextWeek())
    .orderBy('startAt', 'asc')
    .get();

  const schedules = scheduleQuerySnap.docs.map((doc) => doc.data());
  const scheduleDates = getNextDaysStr(14).map((date) => getDateWithDay(date));

  const castSchedules: CastSchedule[] = scheduleDates.map((date) => {
    const events = schedules
      .map((schedule) => {
        const day = getDateWithDay(schedule.startAt);
        if (day === date && schedule.type !== ScheduleType.Canceled) {
          return {
            at: schedule.type === 'AfterTalk' ? '' : getTime(schedule.startAt),
            isHoliday: schedule.type === ScheduleType.Holiday,
            label: getScheduleTypeDisplayName(schedule.type),
          };
        } else {
          return null;
        }
      })
      .filter(notNull);
    return {
      date,
      events,
    };
  });

  return castSchedules;
};
