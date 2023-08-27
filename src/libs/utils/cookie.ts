export const generateHeaderCookieString = ({
  key,
  value,
  path,
  domain,
  expires,
  isSecure,
}: {
  key: string;
  value: string;
  expires: Date;
  domain?: string;
  path?: string;
  isSecure?: boolean;
}): string => {
  const values = [`${key}=${value}`];
  values.push(`Expires=${expires.toUTCString()}`);
  if (path) values.push(`Path=${path}`);
  if (domain) values.push(`Domain=${domain}`);
  if (isSecure) {
    values.push('Secure');
    values.push('SameSite=None');
    values.push('HttpOnly');
  }
  return values.join('; ');
};

export const checkBoolString = (boolString: string): boolean =>
  boolString === 'true';
