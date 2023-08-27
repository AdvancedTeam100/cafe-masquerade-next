import { CastParams } from '@/store/admin/cast';
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  id: Yup.string()
    .required('idを入力してください')
    .matches(/^[a-zA-Z0-9-]+$/, 'idは英数字と-のみ利用できます')
    .max(50, 'idは50文字以内で入力してください'),
  name: Yup.string()
    .required('名前を入力してください')
    .max(50, '名前は50文字以内で入力してください'),
  description: Yup.string()
    .required('説明を入力してください')
    .max(1000, '説明は1000文字以内で入力してください'),
  livestreamingDescription: Yup.string().required('説明を入力してください'),
  selfIntroduction: Yup.string().max(
    1000,
    '本人のコメントは1000文字以内で入力してください',
  ),
  physicalInformation: Yup.object({
    height: Yup.number().required('身長を入力してください'),
    weight: Yup.number().required('体重を入力してください'),
    bustSize: Yup.number().required('バストサイズを入力してください'),
    cupSize: Yup.string().required('カップサイズを入力してください'),
    waistSize: Yup.number().required('ウエストサイズを入力してください'),
    hipSize: Yup.number().required('ヒップサイズを入力してください'),
  }),
  status: Yup.string().required('ステータスを選択してください'),
  tags: Yup.array().of(Yup.string()),
  youtubeChannelId: Yup.string().required(
    'YouTubeチャンネルIDを入力してください',
  ),
  youtubeChannelIdSecond: Yup.string().nullable(),
  socialId: Yup.object({
    twitter: Yup.string().required('Twitterのusernameを入力してください'),
    twitcasting: Yup.string().nullable(),
    tiktok: Yup.string().nullable(),
    niconico: Yup.string().nullable(),
  }),
  joinedAt: Yup.string().required('入店日を入力してください'),
  qa: Yup.array().of(
    Yup.object({
      question: Yup.string().required('質問を入力してください'),
      answer: Yup.string().required('回答を入力してください'),
    }),
  ),
  notificationDiscordUrl: Yup.string().url('URLを入力してください').nullable(),
});

export type FormData = CastParams;
