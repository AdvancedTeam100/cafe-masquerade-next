import * as crypto from 'crypto';
import * as admin from 'firebase-admin';
import { encryptedKey } from './encryptedKey';

export const getServiceAccountKey = () => {
  const key = process.env.FIREBASE_ENCRYPTION_KEY;
  const iv = process.env.FIREBASE_ENCRYPTION_IV;
  if (!key || !iv) return;
  const algorithm = 'aes-128-cbc';
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decryptedKey = decipher.update(
    process.env.NEXT_PUBLIC_PROJECT_ID === 'masquerade-dev'
      ? encryptedKey.dev
      : encryptedKey.prod,
    'base64',
    'utf8',
  );
  decryptedKey += decipher.final('utf8');

  return JSON.parse(decryptedKey) as admin.ServiceAccount;
};
