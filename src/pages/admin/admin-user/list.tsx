import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AdminTemplate from '@/containers/admin/Template';
import AdminUserList from '@/containers/admin/AdminUserList';
import AdminUserCreateModal from '@/containers/admin/AdminUserCreateModal';

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

const AdminAdminUserList = () => {
  const classes = useStyles();
  const [isCreateModalOpened, setIsCreateModalOpened] = useState(false);
  return (
    <AdminTemplate>
      <div className={classes.header}>
        <Typography variant="h2" className={classes.title}>
          管理者
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreateModalOpened(true)}
          startIcon={<GroupAddIcon />}
        >
          管理者を追加
        </Button>
      </div>
      <Divider />
      <AdminUserList />
      <AdminUserCreateModal
        isOpened={isCreateModalOpened}
        handleClose={() => setIsCreateModalOpened(false)}
      />
    </AdminTemplate>
  );
};

export default AdminAdminUserList;
