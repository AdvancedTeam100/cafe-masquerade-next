import { LivestreamingCreateParams } from '@/store/admin/livestreaming';
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('タイトルを入力してください')
    .max(100, 'タイトルは100文字以内で入力してください'),
  publishedAt: Yup.string().required('配信日時を入力してください'),
  rawPassword: Yup.string()
    .min(6, 'パスワードは6文字以上で入力してください')
    .max(30, 'パスワードは30文字以内で入力してください'),
});

export type FormData = Pick<
  LivestreamingCreateParams,
  | 'title'
  | 'description'
  | 'publishedAt'
  | 'thumbnail'
  | 'rawPassword'
  | 'requiredRole'
  | 'videoConfig'
  | 'shouldStartRecording'
>;
