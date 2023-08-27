import { EditorState } from 'draft-js';
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  contents: Yup.array().of(
    Yup.object({
      title: Yup.string()
        .required('タイトルを入力してください')
        .max(50, 'タイトルは50文字以内で入力してください'),
      subTitle: Yup.string()
        .required('サブタイトルを入力してください')
        .max(50, 'サブタイトルは50文字以内で入力してください'),
      content: Yup.string(),
    }),
  ),
});

export type FormData = {
  contents: {
    title: string;
    subTitle: string;
    contentState: EditorState;
    content: string;
  }[];
};
