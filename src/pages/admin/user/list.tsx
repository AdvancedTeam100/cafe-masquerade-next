import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import AdminTemplate from '@/containers/admin/Template';
import UserList from '@/containers/admin/UserList';

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '1.3rem',
  },
}));

const AdminUserListPage = () => {
  const classes = useStyles();

  return (
    <AdminTemplate>
      <div className={classes.header}>
        <Typography variant="h2" className={classes.title}>
          ユーザー
        </Typography>
      </div>
      <Divider />
      <UserList />
    </AdminTemplate>
  );
};

export default AdminUserListPage;
