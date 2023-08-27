export const NewsStatus = {
  Draft: 'Draft',
  Limited: 'Limited',
  Published: 'Published',
} as const;

export type NewsStatus = typeof NewsStatus[keyof typeof NewsStatus];

export type News = {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  status: NewsStatus;
  tags: string[];
  createdUserId: string;
  updatedUserId: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};
