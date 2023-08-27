export type LivestreamingMessage = {
  id: string;
  text: string;
  user: {
    name: string;
    avatarUrl: string;
    isAdmin?: boolean;
    castId?: string | null;
    userId?: string;
  };
  createdAt: string;
  color?: string;
  isFixed?: boolean;
};
