import { CastStatus } from '@/libs/models/cast';

export type Column = {
  id:
    | 'status'
    | 'imageUrl'
    | 'id'
    | 'name'
    | 'tags'
    | 'joinedAt'
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
    id: 'id',
    label: 'id',
    minWidth: 200,
    width: 500,
    align: 'left',
  },
  {
    id: 'name',
    label: '名前',
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
    id: 'joinedAt',
    label: '入店日',
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
  status: CastStatus;
  imageUrl: string;
  name: string;
  tags: string;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
};
