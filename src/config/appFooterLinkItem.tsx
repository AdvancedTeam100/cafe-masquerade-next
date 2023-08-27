export type FooterLinkItem = {
  title: string;
  href: string;
};

export const smFooterLinkItems: FooterLinkItem[] = [
  {
    title: '出勤表',
    href: '/schedules',
  },
  {
    title: '在籍表',
    href: '/casts',
  },
  {
    title: 'お知らせ',
    href: '/news',
  },
  {
    title: '過去のお給仕',
    href: '/videos',
  },
  {
    title: 'コンセプト',
    href: '/concept',
  },
  {
    title: 'ご利用方法',
    href: '/about-masquerade',
  },
];

export const mdFooterLinkItems = [
  ...smFooterLinkItems,
  {
    title: 'お問い合わせ',
    href: '/contact',
  },
];

export const termsAndPrivacyLinkItems = [
  {
    title: '利用規約',
    href: '/terms',
  },
  {
    title: 'プライバシーポリシー',
    href: '/policy',
  },
];
