import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('このメールアドレスは無効です')
    .required('メールアドレスを入力してください'),
});

export type FormData = {
  email: string;
};
