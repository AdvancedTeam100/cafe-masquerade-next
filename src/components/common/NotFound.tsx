import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    margin: '120px auto 0',
    height: 'calc(100vh - 208px)',
  },
  title: {
    fontSize: '2em',
    textAlign: 'center',
  },
}));

const NotFound = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <h2 className={classes.title}>404</h2>
      <h2 className={classes.title}>お探しのページは見つかりませんでした</h2>
    </div>
  );
};

export default NotFound;
