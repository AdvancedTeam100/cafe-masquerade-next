import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import AdminTemplate from '@/containers/admin/Template';
import BlockedContactUserList from '@/containers/admin/BlockedContactUserList';
import BlockedContactUserCreateModal from '@/containers/admin/BlockedContactUserCreateModal';

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
  link: {
    textDecoration: 'none',
  },
}));

const AdminBlockedContactUserList = () => {
  const classes = useStyles();
  const [isCreateModalOpened, setIsCreateModalOpened] = useState(false);
  return (
    <AdminTemplate>
      <div className={classes.header}>
        <Typography variant="h2" className={classes.title}>
          お問い合わせブロック一覧
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CreateOutlinedIcon />}
          onClick={() => setIsCreateModalOpened(true)}
        >
          ブロックするユーザーの登録
        </Button>
      </div>
      <Divider />
      <BlockedContactUserList />
      <BlockedContactUserCreateModal
        isOpened={isCreateModalOpened}
        handleClose={() => setIsCreateModalOpened(false)}
      />
    </AdminTemplate>
  );
};

export default AdminBlockedContactUserList;
