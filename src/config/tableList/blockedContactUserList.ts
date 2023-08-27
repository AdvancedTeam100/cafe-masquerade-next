export type Column = {
  id: 'email' | 'blockedAt' | 'operation';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
};

export const columns: Column[] = [
  {
    id: 'email',
    label: 'ブロックしたメールアドレス',
    minWidth: 170,
    align: 'left',
  },
  {
    id: 'blockedAt',
    label: 'ブロックした日時',
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
  email: string;
  blockedAt: string;
};
