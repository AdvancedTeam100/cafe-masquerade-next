import crypto from 'crypto';
export const createMd5Hash = (string: string) =>
  crypto.createHash('md5').update(string, 'utf8').digest('hex');
