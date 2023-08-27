import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Cast } from '@/libs/models/cast';
import { authSelectors } from '@/store/auth';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2),
  },
  container: {
    width: '100%',
  },
  title: {
    fontSize: '1.1rem',
  },
  formControl: {
    maxWidth: '500px',
    margin: theme.spacing(3, 0),
  },
  input: {
    width: '100%',
  },
  alert: {
    marginTop: theme.spacing(1),
  },
}));

type Props = {
  casts: ReadonlyArray<Cast>;
  currentCastId: string;
  onChangeCast: (castId: string) => void;
};

const AdminLivestreamingCastSelector: React.FC<Props> = ({
  casts,
  currentCastId,
  onChangeCast,
}) => {
  const classes = useStyles();
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChangeCast(event.target.value as string);
  };

  const { user, isFetching: isFetchingUser } = useSelector(authSelectors.state);
  const isCast = user?.role === 'cast' && 'castId' in user;

  return (
    <Paper className={classes.root}>
      <div className={classes.container}>
        <Typography variant="h3" className={classes.title}>
          配信キャスト
        </Typography>
        {!currentCastId && (
          <Alert severity="warning" className={classes.alert}>
            配信キャストを選択してください。選択したキャストのDiscordチャンネルに配信開始のアナウンスが送信されます。
          </Alert>
        )}
        {currentCastId &&
          !casts.filter((v) => v.id === currentCastId)[0]
            ?.notificationDiscordUrl && (
            <Alert severity="warning" className={classes.alert}>
              配信開始時に通知するためのDiscordのURLが設定されていません。
              <Link
                href={'/admin/cast/[id]'}
                as={`/admin/cast/${currentCastId}`}
              >
                キャストの設定ページ
              </Link>
              から設定してください。
            </Alert>
          )}
        <div className={classes.formControl}>
          <Select
            value={currentCastId}
            onChange={handleChange}
            displayEmpty
            className={classes.input}
            disabled={isFetchingUser || isCast}
          >
            <MenuItem value="">選択なし</MenuItem>
            {casts.map((cast) => (
              <MenuItem value={cast.id} key={cast.id}>
                {cast.name}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </Paper>
  );
};

export default AdminLivestreamingCastSelector;
