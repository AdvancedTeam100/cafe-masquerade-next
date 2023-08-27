import { isProd } from '../utils/env';

export const videoHost = isProd
  ? 'https://video.cafe-masquerade.com'
  : 'https://dev-video.cafe-masquerade.com';
