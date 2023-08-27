import { HomeContentParams } from '@/store/admin/homeContent';
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  sideLinks: Yup.array()
    .of(
      Yup.object({
        title: Yup.string().required('タイトルを入力してください'),
        href: Yup.string()
          .required('URLを入力してください')
          .url('URLを入力してください'),
      }),
    )
    .min(1, 'サイドリンクを入力してください'),
  topImages: Yup.array()
    .of(
      Yup.object({
        href: Yup.string()
          .required('リンク先を入力してください')
          .url('有効なURLを入力してください'),
      }),
    )
    .min(1, 'トップ画像をアップロードしてください'),
});

export type FormData = HomeContentParams;
