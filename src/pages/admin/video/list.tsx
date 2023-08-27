import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import VideoCallOutlinedIcon from '@material-ui/icons/VideoCallOutlined';
import AdminTemplate from '@/containers/admin/Template';
import VideoList from '@/containers/admin/VideoList';

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

const AdminVideoList = () => {
  const classes = useStyles();
  return (
    <AdminTemplate>
      <div className={classes.header}>
        <Typography variant="h2" className={classes.title}>
          動画
        </Typography>
        <Link href="/admin/video/create">
          <a className={classes.link}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<VideoCallOutlinedIcon />}
            >
              動画を投稿
            </Button>
          </a>
        </Link>
      </div>
      <Divider />
      <VideoList />
    </AdminTemplate>
  );
};

export default AdminVideoList;
