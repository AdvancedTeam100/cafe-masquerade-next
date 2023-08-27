import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  text: Yup.string()
    .required('メッセージを入力してください')
    .max(200, 'メッセージは200文字以内で入力してください'),
  userName: Yup.string()
    .required('名前を入力してください')
    .max(20, '名前は20文字以内で入力してください'),
});
