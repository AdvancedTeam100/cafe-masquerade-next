import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';
import AdminTemplate from '@/containers/admin/Template';
import LivestreamingList from '@/containers/admin/LivestreamingList';
import LivestreamingCreateModal from '@/containers/admin/LivestreamingCreateModal';

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

const AdminLivestreamingList = () => {
  const classes = useStyles();
  const [isCreateModalOpened, setIsCreateModalOpened] = useState(false);
  return (
    <AdminTemplate>
      <div className={classes.header}>
        <Typography variant="h2" className={classes.title}>
          ライブ配信
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreateModalOpened(true)}
          startIcon={<AddToQueueIcon />}
        >
          新規ライブ配信枠を作成
        </Button>
      </div>
      <Divider />
      <LivestreamingList />
      <LivestreamingCreateModal
        isOpened={isCreateModalOpened}
        handleClose={() => setIsCreateModalOpened(false)}
      />
    </AdminTemplate>
  );
};

export default AdminLivestreamingList;
