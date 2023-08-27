import OndemandVideoOutlinedIcon from '@material-ui/icons/OndemandVideoOutlined';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import PeopleIcon from '@material-ui/icons/People';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import SupervisorAccountOutlinedIcon from '@material-ui/icons/SupervisorAccountOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import MovieIcon from '@material-ui/icons/Movie';
import { AuthUser } from '@/store/auth';
import { isAdminAuthenticated } from '@/store/auth/operations';

export type SideListItem = {
  title: string;
  href: string;
  key: string;
  icon: React.ReactNode;
};

export const adminSideListItems = (user: AuthUser): SideListItem[] => [
  ...(isAdminAuthenticated(user, 'admin')
    ? [
        {
          title: 'ホーム画面',
          href: '/admin/home/edit',
          key: '/admin/home/edit',
          icon: <HomeOutlinedIcon />,
        },
      ]
    : []),
  ...(isAdminAuthenticated(user, 'cast')
    ? [
        {
          title: 'ライブ配信一覧',
          href: '/admin/livestreaming/list',
          key: '/admin/livestreaming/list',
          icon: <OndemandVideoOutlinedIcon />,
        },
      ]
    : []),
  ...(isAdminAuthenticated(user, 'admin')
    ? [
        {
          title: '動画一覧',
          href: '/admin/video/list',
          key: '/admin/video/list',
          icon: <MovieIcon />,
        },
      ]
    : []),
  ...(isAdminAuthenticated(user, 'admin')
    ? [
        {
          title: 'お知らせ一覧',
          href: '/admin/news/list',
          key: '/admin/news/list',
          icon: <CommentOutlinedIcon />,
        },
      ]
    : []),
  ...(isAdminAuthenticated(user, 'admin')
    ? [
        {
          title: 'キャスト一覧',
          href: '/admin/cast/list',
          key: '/admin/cast/list',
          icon: <PeopleOutlineIcon />,
        },
      ]
    : []),
  ...(isAdminAuthenticated(user, 'admin')
    ? [
        {
          title: 'ご利用方法',
          href: '/admin/about/edit',
          key: '/admin/about/edit',
          icon: <AssignmentTurnedInOutlinedIcon />,
        },
      ]
    : []),
  ...(isAdminAuthenticated(user, 'admin')
    ? [
        {
          title: 'お問い合わせブロック一覧',
          href: '/admin/blocked-contact-users/list',
          key: '/admin/blocked-contact-users/list',
          icon: <ContactMailIcon />,
        },
      ]
    : []),
  ...(isAdminAuthenticated(user, 'admin')
    ? [
        {
          title: 'ユーザー一覧',
          href: '/admin/user/list',
          key: '/admin/user/list',
          icon: <PeopleIcon />,
        },
      ]
    : []),
  ...(isAdminAuthenticated(user, 'superAdmin')
    ? [
        {
          title: '管理者一覧',
          href: '/admin/admin-user/list',
          key: '/admin/admin-user/list',
          icon: <SupervisorAccountOutlinedIcon />,
        },
      ]
    : []),
];
