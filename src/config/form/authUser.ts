import * as Yup from 'yup';
import { AuthUserParams } from '@/store/auth';

export const validationSchema = Yup.object().shape({
  displayName: Yup.string()
    .required('ユーザーネームを入力してください')
    .max(50, 'ユーザーネームは50文字以内で入力してください'),
  email: Yup.string()
    .email('正しいメールアドレスを入力してください')
    .required('メールアドレスを入力してください')
    .max(200, 'メールアドレスは200文字以内で入力してください'),
  dateOfBirth: Yup.object({
    year: Yup.number().required('年を選択してください'),
    month: Yup.number().required('月を選択してください'),
    date: Yup.number().required('日を選択してください'),
  }),
  prefecture: Yup.string(),
});

export type FormData = Omit<AuthUserParams, 'dateOfBirth'> & {
  dateOfBirth: {
    year: number;
    month: number;
    date: number;
  };
};
