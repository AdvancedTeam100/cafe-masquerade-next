import * as Yup from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const validationSchema = Yup.object().shape({
  type: Yup.string().required('お問い合わせの種類を選択してください'),
  name: Yup.string()
    .required('お名前を入力してください')
    .max(50, 'お名前は50文字以内で入力してください'),
  organization: Yup.string().max(100, '団体名は100文字以内で入力してください'),
  email: Yup.string()
    .email('正しいメールアドレスを入力してください')
    .required('メールアドレスを入力してください')
    .max(200, 'メールアドレスは200文字以内で入力してください'),
  phoneNumber: Yup.string().test(
    'phoneNumber',
    '正しい電話番号を入力してください',
    (value) => {
      if (value && value.length > 0) {
        return phoneRegExp.test(value);
      }
      return true;
    },
  ),
  content: Yup.string()
    .required('お問い合わせ内容を入力してください')
    .max(1000, 'お問い合わせ内容は1000文字以内で入力してください'),
});
