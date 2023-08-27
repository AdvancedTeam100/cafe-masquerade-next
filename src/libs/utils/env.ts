export const AppEnv: 'prod' | 'dev' =
  process.env.NEXT_PUBLIC_PROJECT_ID === 'masquerade-prod' ? 'prod' : 'dev';

export const isProd = AppEnv === 'prod';
