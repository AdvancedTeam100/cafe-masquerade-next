import { NewsStatus } from '@/libs/models/news';

export type Column = {
  id:
    | 'status'
    | 'imageUrl'
    | 'title'
    | 'tags'
    | 'publishedAt'
    | 'createdAt'
    | 'updatedAt'
    | 'operation';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
};

export const columns: Column[] = [
  {
    id: 'status',
    label: '公開設定',
    width: 120,
    minWidth: 120,
  },
  { id: 'imageUrl', label: '', width: 160 },
  {
    id: 'title',
    label: 'タイトル',
    minWidth: 200,
    width: 500,
    align: 'left',
  },
  {
    id: 'tags',
    label: 'タグ',
    minWidth: 200,
    align: 'left',
  },
  {
    id: 'publishedAt',
    label: '公開日時',
    minWidth: 170,
    align: 'left',
  },
  {
    id: 'createdAt',
    label: '作成日時',
    minWidth: 170,
    align: 'left',
  },
  {
    id: 'updatedAt',
    label: '更新日時',
    minWidth: 170,
    align: 'left',
  },
  {
    id: 'operation',
    label: '操作',
    minWidth: 170,
    align: 'center',
  },
];

export type Data = {
  id: string;
  status: NewsStatus;
  imageUrl: string;
  title: string;
  tags: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};
