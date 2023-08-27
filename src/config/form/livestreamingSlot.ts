import { LivestreamingSlotParams } from '@/store/admin/livestreamingSlotList';
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('nameを入力してください')
    .max(35, 'nameは35文字以内で入力してください'),
  encoder: Yup.object({
    username: Yup.string()
      .required('ユーザー名を入力してください')
      .max(100, 'ユーザー名は100文字以内で入力してください'),
    password: Yup.string()
      .required('パスワードを入力してください')
      .max(100, 'パスワードは100文字以内で入力してください'),
    streamkey: Yup.string()
      .required('ストリームキーを入力してください')
      .max(100, 'ストリームキーは100文字以内で入力してください'),
    ingestUrl: Yup.object({
      primary: Yup.string().required(
        'インジェストURL(primary)を入力してください',
      ),
      backup: Yup.string().required(
        'インジェストURL(backup)を入力してください',
      ),
    }),
  }),
  playbackUrl: Yup.object({
    hls: Yup.string()
      .url('正しいURLを入力してください')
      .required('HLS Playback URLを入力してください'),
  }),
  sharedSecret: Yup.string(),
});

export type FormData = LivestreamingSlotParams;
