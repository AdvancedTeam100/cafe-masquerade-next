export const removeUndefinedProp = <T extends { [key: string]: unknown }>(
  obj: T,
) => {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
  return obj;
};

export const isEmpty = <T>(obj: T): boolean => {
  return (
    obj &&
    Object.keys(obj).length === 0 &&
    Object.getPrototypeOf(obj) === Object.prototype
  );
};
