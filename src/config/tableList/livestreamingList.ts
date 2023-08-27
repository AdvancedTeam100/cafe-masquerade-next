import { LivestreamingStatus } from '@/libs/models/livestreaming';

export type Column = {
  id: 'status' | 'thumbnailUrl' | 'title' | 'publishedAt';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
};

export const columns: Column[] = [
  { id: 'status', label: 'ライブ配信', width: 120, minWidth: 120 },
  { id: 'thumbnailUrl', label: '', width: 160 },
  {
    id: 'title',
    label: 'タイトル',
    minWidth: 200,
    width: 500,
    align: 'left',
  },
  {
    id: 'publishedAt',
    label: '配信日時',
    minWidth: 170,
    align: 'left',
  },
];

export type Data = {
  id: string;
  status: LivestreamingStatus;
  thumbnailUrl: string;
  title: string;
  publishedAt: string;
  castId?: string | null;
};
