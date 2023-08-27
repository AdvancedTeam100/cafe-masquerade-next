import * as crypto from 'crypto';
import { generateHeaderCookieString } from '../utils/cookie';

const generateSignature = (
  urlPrefix: string,
  expiresOfUnix: number,
  keyName: string,
  secretKey: string,
) => {
  const decodedKeybytes = Buffer.from(secretKey, 'base64');
  const encodedUrlPrefix = Buffer.from(urlPrefix)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const input = `URLPrefix=${encodedUrlPrefix}:Expires=${expiresOfUnix}:KeyName=${keyName}`;
  const signature = crypto
    .createHmac('sha1', decodedKeybytes)
    .update(input)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const signedValue = `${input}:Signature=${signature}`;

  return signedValue;
};

export const getSignedCookieString = ({
  urlPrefix,
  keyName,
  secretKey,
  domain,
  path,
  expiresOfUnix,
  isSecure,
}: {
  urlPrefix: string;
  keyName: string;
  secretKey: string;
  expiresOfUnix: number;
  domain?: string;
  path?: string;
  isSecure?: boolean;
}): string => {
  const signature = generateSignature(
    urlPrefix,
    expiresOfUnix,
    keyName,
    secretKey,
  );
  return generateHeaderCookieString({
    key: 'Cloud-CDN-Cookie',
    value: signature,
    expires: new Date(expiresOfUnix * 1000),
    domain,
    path,
    isSecure,
  });
};
