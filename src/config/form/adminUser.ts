import { AdminUserParams } from '@/store/admin/adminUser';
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('メールアドレスを入力してください')
    .required('メールアドレスを入力してください'),
  role: Yup.string().required('権限を選択してください'),
  publicDisplayName: Yup.string().required('表示名を入力してください'),
});

export type FormData = AdminUserParams;
