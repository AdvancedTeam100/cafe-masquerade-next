export const generateRandomString = (length: number): string => {
  const list = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const listLength = list.length;
  let random = '';
  for (let i = 0; i < length; i++) {
    random += list[Math.floor(Math.random() * listLength)];
  }
  return random;
};
