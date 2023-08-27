import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault('Asia/Tokyo');

export const isEnableExpiredAt = (expiredAt: string) => {
  const diff = dayjs().tz().diff(dayjs(expiredAt).tz(), 'milliseconds');
  return diff < 0 ? true : false;
};
