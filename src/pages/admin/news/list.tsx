import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import AdminTemplate from '@/containers/admin/Template';
import NewsList from '@/containers/admin/NewsList';

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

const AdminNewsList = () => {
  const classes = useStyles();
  return (
    <AdminTemplate>
      <div className={classes.header}>
        <Typography variant="h2" className={classes.title}>
          お知らせ
        </Typography>
        <Link href="/admin/news/create">
          <a className={classes.link}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CreateOutlinedIcon />}
            >
              お知らせを作成
            </Button>
          </a>
        </Link>
      </div>
      <Divider />
      <NewsList />
    </AdminTemplate>
  );
};

export default AdminNewsList;
