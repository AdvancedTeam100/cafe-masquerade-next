import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CachedIcon from '@material-ui/icons/Cached';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { LivestreamingSlot } from '@/libs/models/livestreamingSlot';
import { colors } from '@/config/ui';
import Alert from '@material-ui/lab/Alert';
import { useSelector } from 'react-redux';
import { livestreamingSelectors } from '@/store/admin/livestreaming';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2),
  },
  container: {
    display: 'flex',
    width: '100%',
  },
  title: {
    fontSize: '1.1rem',
  },
  formControl: {
    maxWidth: '500px',
    margin: theme.spacing(1, 0, 2),
  },
  nestedForm: {
    margin: theme.spacing(0, 1, 1),
  },
  input: {
    margin: theme.spacing(1, 0, 0),
  },
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alert: {
    marginTop: theme.spacing(1),
  },
}));

type Props = {
  isLoading: boolean;
  currentSlot: LivestreamingSlot | undefined;
  livestreamingSlots: ReadonlyArray<LivestreamingSlot>;
  onClickChangeSlot: (slot: LivestreamingSlot) => void;
  onClickCreateSlot: () => void;
  onClickEditSlot: (name: string) => void;
};

const AdminLivestreamingSlotSelector: React.FC<Props> = ({
  isLoading,
  currentSlot,
  livestreamingSlots,
  onClickChangeSlot,
  onClickCreateSlot,
  onClickEditSlot,
}) => {
  const classes = useStyles();
  const { hasSetInfo } = useSelector(livestreamingSelectors.preparing);
  return (
    <Paper className={classes.root}>
      <Grid container className={classes.container} spacing={2}>
        <Grid item xs={6}>
          <Typography variant="h3" className={classes.title}>
            スロット情報
          </Typography>

          <div className={classes.formControl}>
            <TextField
              label={currentSlot ? 'Slot name' : 'スロットを選択してください'}
              value={currentSlot?.name ?? ''}
              InputProps={{
                readOnly: true,
              }}
              size="small"
              fullWidth
              className={classes.input}
            />
          </div>
          <div className={classes.formControl}>
            <InputLabel>エンコーダー情報</InputLabel>
            <div className={classes.nestedForm}>
              <TextField
                label="ユーザー名"
                value={currentSlot?.encoder.username ?? ''}
                InputProps={{
                  readOnly: true,
                }}
                size="small"
                fullWidth
                className={classes.input}
              />
              <TextField
                label="パスワード"
                value={currentSlot?.encoder.password ?? ''}
                InputProps={{
                  readOnly: true,
                }}
                size="small"
                fullWidth
                className={classes.input}
              />
              <TextField
                label="ストリームキー"
                value={currentSlot?.encoder.streamkey ?? ''}
                InputProps={{
                  readOnly: true,
                }}
                size="small"
                fullWidth
                className={classes.input}
              />
              <TextField
                label="インジェストURL(primary)"
                value={currentSlot?.encoder.ingestUrl.primary ?? ''}
                InputProps={{
                  readOnly: true,
                }}
                size="small"
                fullWidth
                className={classes.input}
              />
              <TextField
                label="インジェストURL(backup)"
                value={currentSlot?.encoder.ingestUrl.backup ?? ''}
                InputProps={{
                  readOnly: true,
                }}
                size="small"
                fullWidth
                className={classes.input}
              />
            </div>
          </div>
          <div className={classes.formControl}>
            <InputLabel>配信情報</InputLabel>
            <div className={classes.nestedForm}>
              <TextField
                label="HLS Playback URL"
                value={currentSlot?.playbackUrl.hls ?? ''}
                InputProps={{
                  readOnly: true,
                }}
                size="small"
                fullWidth
                className={classes.input}
              />
              <TextField
                label="Shared Secret"
                value={currentSlot?.sharedSecret ?? ''}
                InputProps={{
                  readOnly: true,
                }}
                size="small"
                fullWidth
                className={classes.input}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.flexBetween}>
            <Typography variant="h3" className={classes.title}>
              スロット一覧
            </Typography>
            <Button
              variant="outlined"
              onClick={onClickCreateSlot}
              color="default"
              startIcon={<EditOutlinedIcon />}
            >
              スロット登録
            </Button>
          </div>
          {!hasSetInfo && (
            <Alert severity="error" className={classes.alert}>
              配信するスロットを適用してください
            </Alert>
          )}
          <div className={classes.formControl}>
            <List>
              {isLoading && <LinearProgress />}
              {livestreamingSlots.map((slot) => (
                <ListItem key={slot.name}>
                  <ListItemIcon>
                    {slot.name === currentSlot?.name ? (
                      <Tooltip title="選択済み">
                        <DoneOutlineIcon htmlColor={colors.green} />
                      </Tooltip>
                    ) : (
                      <Tooltip title="適用する">
                        <IconButton
                          edge="start"
                          aria-label="apply"
                          onClick={() => onClickChangeSlot(slot)}
                        >
                          <CachedIcon htmlColor={colors.text} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </ListItemIcon>
                  <ListItemText primary={slot.name} />
                  <ListItemSecondaryAction>
                    <Tooltip title="編集">
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => onClickEditSlot(slot.name)}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AdminLivestreamingSlotSelector;
