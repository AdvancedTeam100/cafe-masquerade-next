export type HeaderLinkItem = {
  title: string;
  subTitle: string;
  iconPath: string;
  href: string;
};

export const headerLinkItems: HeaderLinkItem[] = [
  {
    title: '出勤表',
    subTitle: 'Schedule',
    iconPath: '/icon_schedule.png',
    href: '/schedules',
  },
  {
    title: '在籍表',
    subTitle: 'Casts list',
    iconPath: '/icon_casts.png',
    href: '/casts',
  },
  {
    title: 'お知らせ',
    subTitle: 'News',
    iconPath: '/icon_news.png',
    href: '/news',
  },
  {
    title: '過去のお給仕',
    subTitle: 'Showcase',
    iconPath: '/icon_archives.png',
    href: '/videos',
  },
  {
    title: 'コンセプト',
    subTitle: 'Concept',
    iconPath: '/icon_concept.png',
    href: '/concept',
  },
  {
    title: 'ご利用方法',
    subTitle: 'How to play',
    iconPath: '/icon_about.png',
    href: '/about-masquerade',
  },
];
