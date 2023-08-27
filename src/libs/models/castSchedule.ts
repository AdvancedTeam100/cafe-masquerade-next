export type CastSchedule = {
  date: string;
  events: {
    at: string;
    isHoliday: boolean;
    label: string | null;
  }[];
};
