import { NewsStatus } from '@/libs/models/news';
import { EditorState } from 'draft-js';
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('タイトルを入力してください')
    .max(50, 'タイトルは50文字以内で入力してください'),
  description: Yup.string()
    .required('説明を入力してください')
    .max(100, '説明は100文字以内で入力してください'),
  content: Yup.string(),
  status: Yup.string().required('ステータスを選択してください'),
  publishedAt: Yup.string().required('配信日時を入力してください'),
});

export type FormData = {
  title: string;
  description: string;
  status: NewsStatus;
  contentState: EditorState;
  publishedAt: string;
  image: File;
  tags: string[];
};
