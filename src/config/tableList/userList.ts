import { UserRole } from '@/libs/models/user';

export type Column = {
  id:
    | 'uid'
    | 'displayName'
    | 'email'
    | 'avatarUrl'
    | 'role'
    | 'discordId'
    | 'dateOfBirth'
    | 'sex'
    | 'prefecture'
    | 'createdAt';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
};

export const columns: Column[] = [
  { id: 'avatarUrl', label: '', width: 40 },
  {
    id: 'displayName',
    label: 'ユーザー名',
    minWidth: 200,
    width: 300,
    align: 'left',
  },
  {
    id: 'email',
    label: 'メールアドレス',
    minWidth: 100,
    width: 200,
    align: 'left',
  },
  {
    id: 'role',
    label: '会員ランク',
    minWidth: 180,
    width: 180,
    align: 'left',
  },
  {
    id: 'discordId',
    label: 'Discord ID',
    minWidth: 200,
    width: 200,
    align: 'left',
  },
  {
    id: 'dateOfBirth',
    label: '生年月日',
    minWidth: 100,
    width: 100,
    align: 'left',
  },
  {
    id: 'sex',
    label: '性別',
    minWidth: 82,
    width: 82,
    align: 'left',
  },
  {
    id: 'prefecture',
    label: '都道府県',
    minWidth: 100,
    width: 100,
    align: 'left',
  },
  {
    id: 'createdAt',
    label: '登録日',
    minWidth: 100,
    width: 100,
    align: 'left',
  },
];

export type Data = Record<Column['id'], string> & {
  role: UserRole;
};
