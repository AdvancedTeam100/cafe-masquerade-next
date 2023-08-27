import { VideoRequiredRole } from '@/libs/models/video';
import { VideoParams } from '@/store/admin/video';
import * as Yup from 'yup';

const mapRules = (
  map: Record<VideoRequiredRole, string>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rule: Yup.StringSchema<any, any, any>,
) => Object.keys(map).reduce((newMap, key) => ({ ...newMap, [key]: rule }), {});

export const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('タイトルを入力してください')
    .max(50, 'タイトルは50文字以内で入力してください'),
  description: Yup.string()
    .required('説明を入力してください')
    .max(1000, '説明は1000文字以内で入力してください'),
  status: Yup.string().required('公開設定を選択してください'),
  thumbnailUrl: Yup.string().required('サムネイルをアップロードしてください'),
  type: Yup.string().nullable().required('動画の種類を選択してください'),
  requiredRole: Yup.string().nullable().required('公開範囲を選択してください'),
  publishedAt: Yup.string().required('公開日時を入力してください'),
  expiredAt: Yup.lazy((obj) =>
    Yup.object(mapRules(obj, Yup.string().nullable())),
  ),
});

export type FormData = VideoParams;
