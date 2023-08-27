import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault('Asia/Tokyo');

export const dayOfWeeks = ['日', '月', '火', '水', '木', '金', '土'];

export const getDateTimeSecondString = (dateTime: Date | string) =>
  dayjs(dateTime).tz().format('YYYY/MM/DD HH:mm:ss');

export const getDateTimeString = (dateTime: Date | string) =>
  dayjs(dateTime).tz().format('YYYY/MM/DD HH:mm');

export const getDateString = (dateTime: Date | string) =>
  dayjs(dateTime).tz().format('YYYY/MM/DD');

export const getDateStringDots = (dateTime: Date | string) =>
  dayjs(dateTime).tz().format('YYYY.MM.DD');

export const getDateStringHyphens = (dateTime: Date | string) =>
  dayjs(dateTime).tz().format('YYYY-MM-DD');

export const getDateStringJa = (dateTime: Date | string) =>
  dayjs(dateTime).tz().format('YYYY年MM月DD日');

export const getTime = (dateTime: Date | string) =>
  dayjs(dateTime).tz().format('HH:mm');

export const getISOString = (dateTime: Date | string) =>
  dayjs(dateTime).tz().format('YYYY-MM-DDTHH:mm');

export const getRelativeDateString = ({
  targetTime,
  suffix = '',
  showDate = false,
  showSeconds = false,
}: {
  targetTime: Date | string;
  suffix?: string;
  showDate?: boolean;
  showSeconds?: boolean;
}) => {
  const currentDate = dayjs().tz();
  const targetDate = dayjs(targetTime).tz();

  const diff = Math.abs(currentDate.diff(targetDate));
  const day = diff / (24 * 60 * 60 * 1000);
  if (day > 1) {
    if (showDate) return targetDate.format('YYYY/MM/DD');
    if (day < 7) return `${Math.round(day)}日${suffix}`;
    if (day < 30) return `${Math.round(day / 7)}週間${suffix}`;

    const month = Math.round(day / 30);
    if (month < 12) return `${month}ヶ月${suffix}`;
    return `${Math.round(month / 12)}年${suffix}`;
  }

  const hour = diff / (60 * 60 * 1000);
  if (hour > 1) return `${Math.floor(hour)}時間${suffix}`;
  const minute = Math.floor(diff / (60 * 1000));
  if (minute > 0 || !showSeconds) return `${minute}分${suffix}`;
  return `${Math.floor(diff / 1000)}秒${suffix}`;
};

export const getDateWithDay = (dateTime: Date | string) => {
  const date = dayjs(dateTime).tz();
  const dateStr = date.format('MM/DD');
  const dayStr = dayOfWeeks[date.toDate().getDay()];
  return `${dateStr}(${dayStr})`;
};

export const getNextDaysStr = (n: number) =>
  [...Array(n).keys()].map((number) => {
    const date = dayjs().tz().toDate();
    date.setDate(date.getDate() + number);
    return getDateStringHyphens(date);
  });

export const getTomorrowUnixtime = (targetDate: Date) => {
  targetDate.setDate(targetDate.getDate() + 1);
  return targetDate.getTime();
};

export const getStartOfPreviousDate = (date?: Date) =>
  dayjs(date).tz().add(-1, 'day').startOf('day').toDate();

export const getStartOfDate = (date?: Date) =>
  dayjs(date).tz().startOf('day').toDate();

export const getStartOfNextDate = (date?: Date) =>
  dayjs(date).tz().add(1, 'day').startOf('day').toDate();

export const getEndOfNextWeekDate = (dateTime: Date | string) =>
  dayjs(dateTime).tz().add(7, 'day').endOf('day').toDate();

export const getEndOfThisWeek = () =>
  dayjs().tz().add(6, 'day').endOf('day').toDate();

export const getEndOfNextWeek = () =>
  dayjs().tz().add(13, 'day').endOf('day').toDate();

export const getIndefiniteDate = () => dayjs().tz().add(100, 'years').toDate();

export const getYearList = () => {
  const max = new Date().getFullYear() - 18;
  const years = [];
  let startYear = 1950;
  while (startYear <= max) {
    years.push(startYear++);
  }
  return years;
};

export const getDateList = (year?: number, month?: number) => {
  const days = [];
  let daysInMonth = 31;
  if (year && month) {
    daysInMonth = dayjs(`${year}-${month}`).daysInMonth();
  }
  for (let index = 1; index <= daysInMonth; index++) {
    days.push(index);
  }
  return days;
};

export const getTimeFromSeconds = (msec: number) => {
  const hours = Math.floor(msec / 3600);
  const time = msec - hours * 3600;
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);

  const m = minutes >= 10 ? minutes : `0${minutes}`;
  const s = seconds >= 10 ? seconds : `0${seconds}`;

  return hours ? `${hours}:${m}:${s}` : `${minutes}:${s}`;
};
