import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { Livestreaming } from '@/libs/models/livestreaming';
import {
  LivestreamingInfo,
  LivestreamingPassword,
} from '@/libs/models/livestreamingCredential';
import { colors } from '@/config/ui';
import {
  getDateTimeString,
  getRelativeDateString,
} from '@/libs/utils/dateFormat';
import { copyToClipboard } from '@/libs/utils/text';
import { userRoleToDisplayName } from '@/libs/models/user';
import RoleIcon from '@/components/common/RoleIcon';
import LivestreamingPreview from '@/components/admin/LivestreamingPreview';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import dayjs from 'dayjs';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    width: '100%',
  },
  previewContainer: {
    width: '424px',
  },
  linkContainer: {
    width: '424px',
    padding: '0 0 0 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streamingMovieLink: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '330px',
    overflow: 'hidden',
    borderBottom: 'solid 1px',
    paddingBottom: '5px',
  },
  linkCopyButton: {
    padding: '8px',
  },
  infoContainer: {
    padding: theme.spacing(2, 3, 0),
    width: 'calc(100% - 424px)',
  },
  infoLeft: {
    width: 'calc(100% - 140px)',
    maxWidth: '800px',
  },
  infoRight: {
    width: '120px',
  },
  buttonContainer: {
    textAlign: 'right',
    marginBottom: '16px',
  },
  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
  },
  label: {
    color: colors.darkGray,
    fontSize: '12px',
    marginBottom: '4px',
  },
  content: {
    fontSize: '16px',
  },
  scrollableContent: {
    overflowY: 'auto',
    maxHeight: '200px',
    whiteSpace: 'pre-line',
    fontSize: '15px',
    '&::-webkit-scrollbar': {
      width: '10px',
      height: '6px',
    },
    /*スクロールバーの軌道*/
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0, 0, 0, .1)',
    },
    /*スクロールバーの動く部分*/
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 50, .5)',
      boxShadow: '0 0 0 1px rgba(255, 255, 255, .3)',
    },
  },
  thumbnailImage: {
    objectFit: 'contain',
  },
}));

type Props = {
  livestreaming: Livestreaming;
  livestreamingInfo: LivestreamingInfo | null;
  livestreamingPassword: LivestreamingPassword;
  onClickEdit: () => void;
};

const AdminLivestreamingPageTop: React.FC<Props> = ({
  livestreaming,
  livestreamingInfo,
  livestreamingPassword,
  onClickEdit,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [current, setCurrent] = useState(dayjs());
  const publishedAt = dayjs(livestreaming.publishedAt);

  useEffect(() => {
    const timeoutId = setTimeout(() => setCurrent(dayjs()), 1000);
    () => clearTimeout(timeoutId);
  }, [current]);

  const getLivestreamingPageLink = useCallback(
    (isPass?: boolean) => {
      if (window) {
        return isPass
          ? `${window.location.origin}/livestreaming/pass/${livestreaming.id}`
          : `${window.location.origin}/livestreaming/${livestreaming.id}`;
      } else {
        return '';
      }
    },
    [livestreaming],
  );

  return (
    <Paper className={classes.container}>
      <div style={{ marginRight: '40px' }}>
        <div className={classes.previewContainer}>
          <LivestreamingPreview
            srcUrl={livestreamingInfo?.encodedUrl}
            isEnableToPlay={true}
            thumbnailUrl={livestreaming.thumbnailUrl}
            playerOptions={{
              muted: true,
              autoplay: true,
              controlBar: {
                currentTimeDisplay: false,
                timeDivider: false,
                durationDisplay: false,
              },
            }}
          />
        </div>
        <div style={{ marginTop: '8px' }}>
          <div className={classes.linkContainer}>
            <div className={classes.flexColumn}>
              <span className={classes.label}>動画リンク</span>
              <p className={classes.streamingMovieLink}>
                {getLivestreamingPageLink()}
              </p>
            </div>
            <Tooltip title="動画のリンクをコピー">
              <Button
                onClick={() =>
                  copyToClipboard(getLivestreamingPageLink(), () =>
                    enqueueSnackbar('リンクをコピーしました'),
                  )
                }
                variant={'outlined'}
                size={'small'}
                className={classes.linkCopyButton}
              >
                コピー
              </Button>
            </Tooltip>
          </div>
          <div className={classes.linkContainer}>
            <div className={classes.flexColumn}>
              <span className={classes.label}>動画リンク（パスワード）</span>
              <p className={classes.streamingMovieLink}>
                {getLivestreamingPageLink(true)}
              </p>
            </div>
            <Tooltip title="動画のリンクをコピー">
              <Button
                onClick={() =>
                  copyToClipboard(getLivestreamingPageLink(true), () =>
                    enqueueSnackbar('リンクをコピーしました'),
                  )
                }
                variant={'outlined'}
                size={'small'}
                className={classes.linkCopyButton}
              >
                コピー
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className={classes.infoContainer}>
        <div className={classes.flexBetween}>
          <div className={classes.infoLeft}>
            <div className={classes.flexColumn}>
              <span className={classes.label}>タイトル</span>
              <span className={classes.content}>{livestreaming.title}</span>
            </div>
            <div className={classes.flex}>
              <div className={classes.flexColumn}>
                <span className={classes.label}>配信予定日時</span>
                <span className={classes.content}>
                  {getDateTimeString(livestreaming.publishedAt)}
                </span>
                {publishedAt.diff(current) > 0 && (
                  <Alert severity="warning">
                    <AlertTitle>配信予定日時になっていません</AlertTitle>
                    配信まであと
                    {getRelativeDateString({
                      targetTime: publishedAt.toDate(),
                      showSeconds: true,
                    })}
                  </Alert>
                )}
              </div>
              <div
                className={classes.flexColumn}
                style={{ marginLeft: '24px' }}
              >
                <span className={classes.label}>パスワード</span>
                <span className={classes.content}>
                  {livestreamingPassword.rawPassword}
                </span>
              </div>
            </div>
            <div className={classes.flexColumn}>
              <span className={classes.label}>閲覧可能範囲</span>
              <span className={classes.flex}>
                <RoleIcon role={livestreaming.requiredRole} />
                <span className={classes.content} style={{ margin: '0 4px' }}>
                  {userRoleToDisplayName[livestreaming.requiredRole]}以上
                </span>
              </span>
            </div>
            <div className={classes.flexColumn}>
              <span className={classes.label}>説明</span>
              <span
                className={clsx(classes.content, classes.scrollableContent)}
              >
                {livestreaming.description}
              </span>
            </div>
          </div>
          <div className={classes.infoRight}>
            <div className={classes.buttonContainer}>
              <Button
                variant="contained"
                onClick={onClickEdit}
                color="default"
                startIcon={<EditOutlinedIcon />}
              >
                編集
              </Button>
            </div>
            <div className={classes.flexColumn}>
              <span className={classes.label}>サムネイル</span>
              <img
                src={livestreaming.thumbnailUrl}
                alt={livestreaming.title}
                width={100}
                height={56}
                className={classes.thumbnailImage}
              />
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default AdminLivestreamingPageTop;
