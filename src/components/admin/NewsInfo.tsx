import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { News } from '@/libs/models/news';
import { colors } from '@/config/ui';
import { getDateTimeString } from '@/libs/utils/dateFormat';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing(1.5, 0),
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 0),
  },
  label: {
    color: colors.semiDarkGray,
    width: '80px',
  },
  content: {},
}));

type Props = {
  news: News;
};

const AdminNewsTagForm = memo<Props>(({ news }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.item}>
        <span className={classes.label}>作成日</span>
        <span className={classes.content}>
          {getDateTimeString(news.createdAt)}
        </span>
      </div>
      <div className={classes.item}>
        <span className={classes.label}>最終更新日</span>
        <span className={classes.content}>
          {getDateTimeString(news.updatedAt)}
        </span>
      </div>
    </div>
  );
});

export default AdminNewsTagForm;
