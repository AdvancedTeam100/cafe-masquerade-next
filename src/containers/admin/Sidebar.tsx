import { useMemo } from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { sidebarWidth, smallSidebarWidth } from '@/config/ui';
import { adminSideListItems } from '@/config/adminSideListItem';
import SideListItem from '@/components/admin/SideListItem';
import { AuthUser } from '@/store/auth';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: sidebarWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: sidebarWidth,
    backgroundColor: theme.palette.background.default,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  smallDrawer: {
    width: smallSidebarWidth,
    flexShrink: 0,
  },
  smallDrawerPaper: {
    width: smallSidebarWidth,
  },
  smallDrawerContainer: {
    margin: '0 auto',
    padding: theme.spacing(1.5, 0),
  },
}));

type Props = {
  user: AuthUser;
};

const AdminSidebar: React.FC<Props> = ({ user }) => {
  const classes = useStyles();
  const listItems = useMemo(() => adminSideListItems(user), [user]);
  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          {listItems.map((item) => (
            <SideListItem item={item} key={item.key} />
          ))}
        </List>
      </div>
    </Drawer>
  );
};

export default AdminSidebar;

type SmallSideProps = {
  goBackOption: {
    href: string;
    as: string;
    label: string;
  };
};

export const SmallSidebar: React.FC<SmallSideProps> = ({ goBackOption }) => {
  const classes = useStyles();
  return (
    <Drawer
      className={classes.smallDrawer}
      variant="permanent"
      classes={{
        paper: classes.smallDrawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.smallDrawerContainer}>
        <Link href={goBackOption.href} as={goBackOption.as}>
          <Tooltip title={goBackOption.label}>
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </Link>
      </div>
    </Drawer>
  );
};
