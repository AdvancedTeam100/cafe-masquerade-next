import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import {
  Livestreaming,
  LivestreamingStatus,
} from '@/libs/models/livestreaming';
import {
  VideoStatus,
  videoStatusToDisplayName,
  videoStatuses,
} from '@/libs/models/video';
import VodeoConfigDynamicForm, {
  DynamicValues,
} from '@/components/admin/VodeoConfigDynamicForm';
import {
  UpdateVideoConfigParams,
  livestreamingSelectors,
} from '@/store/admin/livestreaming';
import Alert from '@material-ui/lab/Alert';
import { useSelector } from 'react-redux';

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
  formContainer: {
    minHeight: '400px',
  },
  formControl: {
    maxWidth: '500px',
    padding: theme.spacing(1.5, 3, 1.5, 0),
  },
  labelRoot: {
    marginLeft: theme.spacing(0),
  },
  buttonContainer: {
    textAlign: 'right',
  },
  alert: {
    marginTop: theme.spacing(1),
  },
}));

type Props = {
  livestreaming: Livestreaming;
  updateVideoConfig: (params: UpdateVideoConfigParams) => void;
  isUpdating: boolean;
};

const AdminLivestreamingVideoConfigForm: React.FC<Props> = ({
  livestreaming,
  updateVideoConfig,
  isUpdating,
}) => {
  const classes = useStyles();
  const { hasSetVideoConfig } = useSelector(livestreamingSelectors.preparing);
  const [shouldStartRecording, setShouldStartRecording] = useState(
    livestreaming.shouldStartRecording,
  );
  const [videoStatus, setVideoStatus] = useState<VideoStatus>(
    livestreaming.videoConfig?.status ?? VideoStatus.Published,
  );
  const initialDynamicValues = {
    type: livestreaming.videoConfig?.type,
    requiredRole: livestreaming.videoConfig?.requiredRole,
    expiredAt: livestreaming.videoConfig?.expiredAt ?? {},
  };
  const [dynamicValues, setDynamicValues] = useState<DynamicValues>(
    initialDynamicValues,
  );

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChangeSwitch = (_: React.ChangeEvent<{}>, checked: boolean) => {
    setShouldStartRecording(checked);
  };

  const handleChangeVideoStatus = (
    e: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const value = e.target.value as VideoStatus;
    setVideoStatus(value);
  };

  const handleChangeDynamicValue = (changedValues: DynamicValues) => {
    setDynamicValues(changedValues);
  };

  const onSubmit = () => {
    if (
      shouldStartRecording &&
      dynamicValues.requiredRole === undefined &&
      dynamicValues.requiredRole === undefined
    ) {
      return;
    }
    const values: UpdateVideoConfigParams = {
      shouldStartRecording,
      videoConfig: shouldStartRecording
        ? ({
            status: videoStatus,
            ...dynamicValues,
          } as Livestreaming['videoConfig'])
        : null,
    };
    updateVideoConfig(values);
  };

  const hasFinished = livestreaming.status === LivestreamingStatus.Finished;

  return (
    <Paper className={classes.root}>
      <div className={classes.container}>
        <Typography variant="h3" className={classes.title}>
          アーカイブ設定
        </Typography>
        {!hasSetVideoConfig && (
          <Alert severity="error" className={classes.alert}>
            動画の種類を選択し，設定を保存してください
          </Alert>
        )}
        <div className={classes.formContainer}>
          <div className={classes.formControl}>
            <FormControlLabel
              control={<Switch color="primary" />}
              checked={shouldStartRecording}
              onChange={handleChangeSwitch}
              label="配信を録画する"
              labelPlacement="start"
              classes={{ root: classes.labelRoot }}
              disabled={false}
            />
          </div>
          {shouldStartRecording && (
            <>
              <Grid item sm={4} xs={12}>
                <div className={classes.formControl}>
                  <InputLabel shrink>公開設定</InputLabel>
                  <Select
                    variant="outlined"
                    value={videoStatus}
                    displayEmpty
                    style={{ minWidth: '120px' }}
                    onChange={handleChangeVideoStatus}
                    disabled={false}
                  >
                    <MenuItem value="" disabled>
                      公開設定を選択してください
                    </MenuItem>
                    {videoStatuses.map((status) => (
                      <MenuItem value={status} key={`status-input-${status}`}>
                        {videoStatusToDisplayName[status]}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </Grid>
              <VodeoConfigDynamicForm
                publishedAt={livestreaming.publishedAt}
                initialValues={initialDynamicValues}
                onChangeValue={handleChangeDynamicValue}
                isEntirelyDisabled={false}
              />
            </>
          )}
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onSubmit}
            disabled={
              isUpdating ||
              hasFinished ||
              (shouldStartRecording &&
                (!dynamicValues.type || !dynamicValues.requiredRole))
            }
          >
            アーカイブ設定を保存
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default AdminLivestreamingVideoConfigForm;
