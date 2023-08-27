export type Column = {
  id:
    | 'id'
    | 'displayName'
    | 'email'
    | 'avatarUrl'
    | 'role'
    | 'publicDisplayName'
    | 'publicAvatarUrl'
    | 'operation';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
};

export const columns: Column[] = [
  { id: 'avatarUrl', label: '', width: 160 },
  {
    id: 'email',
    label: 'メールアドレス',
    minWidth: 200,
    width: 500,
    align: 'left',
  },
  {
    id: 'displayName',
    label: '名前',
    minWidth: 200,
    width: 500,
    align: 'left',
  },
  {
    id: 'role',
    label: '権限',
    minWidth: 200,
    width: 200,
    align: 'left',
  },
  {
    id: 'publicDisplayName',
    label: '表示名',
    minWidth: 200,
    width: 500,
    align: 'left',
  },
  {
    id: 'publicAvatarUrl',
    label: '表示アイコン',
    minWidth: 124,
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
  avatarUrl: string;
  displayName: string;
  email: string;
  role: string;
  publicDisplayName: string;
  publicAvatarUrl: string;
};
