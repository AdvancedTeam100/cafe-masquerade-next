import { User } from './user';

export const adminRoles = ['superAdmin', 'admin', 'cast'] as const;

export type AdminRole = typeof adminRoles[number];

export const DEFAULT_ADMIN_ROLE: AdminRole = 'admin';

export const adminRoleToDisplayName: Record<AdminRole, string> = {
  superAdmin: '特権管理者',
  admin: '管理者',
  cast: 'キャスト',
};

export type AdminUser = Omit<User, 'role'> & {
  role: AdminRole;
  castId?: string | null;
  publicDisplayName: string;
  publicAvatarUrl: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isAdmin = (role: any) => adminRoles.includes(role);
