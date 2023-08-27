import {
  VideoRequiredRole,
  VideoStatus,
  VideoType,
  VideoUploadStatus,
} from '@/libs/models/video';

export type Column = {
  id:
    | 'status'
    | 'thumbnailUrl'
    | 'title'
    | 'type'
    | 'requiredRole'
    | 'publishedAt'
    | 'createdAt'
    | 'updatedAt';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
};

export const columns: Column[] = [
  { id: 'status', label: '公開設定', width: 120, minWidth: 120 },
  { id: 'thumbnailUrl', label: '', width: 100 },
  {
    id: 'title',
    label: 'タイトル',
    minWidth: 200,
    width: 500,
    align: 'left',
  },
  {
    id: 'type',
    label: '動画の種類',
    minWidth: 138,
    align: 'left',
  },
  {
    id: 'requiredRole',
    label: '公開範囲',
    minWidth: 180,
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
];

export type Data = Omit<
  Record<Column['id'], string>,
  'requiredRole' | 'type'
> & {
  id: string;
  status: VideoStatus;
  uploadStatus?: VideoUploadStatus;
  requiredRole?: VideoRequiredRole | null;
  type: VideoType | null;
};
