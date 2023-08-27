export const notNull = <T>(item: T | null): item is NonNullable<T> => {
  return item !== null;
};

export const notNullOrUndefined = <T>(
  item: T | null | undefined,
): item is NonNullable<T> => {
  return item !== null && item !== undefined;
};

export const checkHasSameValue = <T>(arr1: T[], arr2: T[]): boolean =>
  getSameValue(arr1, arr2).length > 0;

export const getSameValue = <T>(arr1: T[], arr2: T[]): T[] => {
  return [...arr1, ...arr2].filter(
    (item) => arr1.includes(item) && arr2.includes(item),
  );
};

export const removeDuplicateItem = <T>(arr: T[]): T[] => {
  const set = new Set(arr);
  return Array.from(set);
};
