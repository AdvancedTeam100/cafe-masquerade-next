import { AdminRole } from './adminUser';

export const UserRole = {
  Diamond: 'diamond',
  Platinum: 'platinum',
  Gold: 'gold',
  Silver: 'silver',
  Bronze: 'bronze',
  Normal: 'normal',
} as const;

export const userRoles = Object.entries(UserRole).map(([_, value]) => value);

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const userRoleToDisplayName: Record<UserRole | AdminRole, string> = {
  diamond: 'ダイヤモンド会員',
  platinum: 'プラチナ会員',
  gold: 'ゴールド会員',
  silver: 'シルバー会員',
  bronze: 'ブロンズ会員',
  normal: '一般会員',
  superAdmin: '特権管理者',
  admin: '管理者',
  cast: 'キャスト',
};

export const getUserRoleName = (role: UserRole, short?: boolean) => {
  switch (role) {
    case 'diamond':
      return short ? 'ダイヤ' : 'ダイヤモンド';
    case 'platinum':
      return 'プラチナ';
    case 'gold':
      return 'ゴールド';
    case 'silver':
      return 'シルバー';
    case 'bronze':
      return 'ブロンズ';
    case 'normal':
      return '一般';
  }
};

export const DEFAULT_USER_ROLE: UserRole = 'normal';

export const Sexes = ['male', 'female', 'other'] as const;

export type Sex = typeof Sexes[number];

export const sexLabel: Record<Sex, string> = {
  male: '男性',
  female: '女性',
  other: 'その他',
};

export type User = {
  uid: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  dateOfBirth?: string;
  prefecture?: string;
  sex?: Sex;
  discordId?: string;
  createdAt: string;
  updatedAt: string;
};
