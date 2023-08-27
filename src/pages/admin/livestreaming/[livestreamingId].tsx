import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import LaunchIcon from '@material-ui/icons/Launch';
import { ThunkDispatch } from '@/store';
import { castListOperations, castListSelectors } from '@/store/admin/castList';
import {
  UpdateVideoConfigParams,
  livestreamingActions,
  livestreamingOperations,
  livestreamingSelectors,
} from '@/store/admin/livestreaming';
import {
  livestreamingSlotListOperations,
  livestreamingSlotListSelectors,
} from '@/store/admin/livestreamingSlotList';
import { LivestreamingSlot } from '@/libs/models/livestreamingSlot';
import AdminTemplate from '@/containers/admin/Template';
import LivestreamingPageTop from '@/containers/admin/LivestreamingPageTop';
import LivestreamingSlotSelector from '@/containers/admin/LivestreamingSlotSelector';
import LivestreamingCastSelector from '@/containers/admin/LivestreamingCastSelector';
import LivestreamingVideoConfigForm from '@/containers/admin/LivestreamingVideoConfigForm';
import LivestreamingEditModal from '@/containers/admin/LivestreamingEditModal';
import LivestreamingSlotCreateModal from '@/containers/admin/LivestreamingSlotCreateModal';
import LivestreamingSlotEditModal from '@/containers/admin/LivestreamingSlotEditModal';
import {
  LivestreamingInfo,
  getEncodedUrl,
} from '@/libs/models/livestreamingCredential';
import { LivestreamingStatus } from '@/libs/models/livestreaming';
import { boxShadow, colors } from '@/config/ui';
import CircularProgress from '@material-ui/core/CircularProgress';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { authSelectors } from '@/store/auth';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    height: 'calc(100vh - 64px)',
  },
  header: {
    paddingBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '1.3rem',
  },
  spacer: {
    margin: theme.spacing(2),
  },
  chatPopupButton: {
    marginRight: theme.spacing(2),
  },
  popper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1, 0),
    boxShadow: boxShadow.default,
  },
  popperItem: {
    margin: theme.spacing(1, 0),
  },
  stopButton: {
    backgroundColor: colors.pink,
    '&:hover': {
      backgroundColor: colors.lightPink,
    },
  },
  deleteButton: {
    backgroundColor: colors.dangerRed,
    color: '#ffffff',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    '&:hover': {
      backgroundColor: colors.lightDangerRed,
    },
  },
  dangerArea: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
  modalContainer: {
    width: '550px',
    padding: theme.spacing(2),
  },
}));

const AdminLivestreamingPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const livestreamingId = router.query.livestreamingId as string;
  const dispatch = useDispatch<ThunkDispatch>();
  const {
    isFetching,
    isUpdating: isUpdatingLive,
    isDeleting,
    livestreaming,
    livestreamingPassword,
    livestreamingInfo,
  } = useSelector(livestreamingSelectors.state);
  const { isReadyForStreaming, hasSetInfo, hasSetVideoConfig } = useSelector(
    livestreamingSelectors.preparing,
  );
  const {
    livestreamingSlots,
    isFetching: isFetchingSlot,
    isCreating: isCreatingSlot,
    isUpdating: isUpdatingSlot,
  } = useSelector(livestreamingSlotListSelectors.state);
  const { castList } = useSelector(castListSelectors.state);
  const { user } = useSelector(authSelectors.state);
  const [isEditModalOpened, setIsEditModalOpened] = useState(false);
  const [isSlotCreateModalOpened, setIsSlotCreateModalOpened] = useState(false);
  const [isSlotEditModalOpened, setIsSlotEditModalOpened] = useState(false);
  const [targetSlot, setTargetSlot] = useState<LivestreamingSlot | undefined>();
  const [livestreamingSlot, setLivestreamingSlot] = useState<
    LivestreamingSlot | undefined
  >();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFinishedModalOpened, setIsFinishedModalOpened] = useState(false);

  const shallowEqualInfoAndSlot = useCallback(
    (info: LivestreamingInfo, slot: LivestreamingSlot): boolean => {
      return (
        info.encodedUrl ===
        getEncodedUrl({
          playbackUrl: slot.playbackUrl.hls,
          publishedAt: livestreaming?.publishedAt ?? '',
          sharedSecret: slot.sharedSecret,
        })
      );
    },
    [livestreaming?.publishedAt],
  );

  useEffect(() => {
    return () => {
      setTargetSlot(undefined);
      setLivestreamingSlot(undefined);
      dispatch(livestreamingActions.resetState());
    };
  }, [livestreamingId, dispatch]);

  useEffect(() => {
    if (livestreamingInfo) {
      const slot = livestreamingSlots.find(
        (slot) => slot.name === livestreamingInfo.slotName,
      );
      if (slot) {
        setLivestreamingSlot(slot);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livestreamingInfo, livestreamingSlots]);

  const get = useCallback(() => {
    dispatch(livestreamingOperations.get(livestreamingId));
  }, [dispatch, livestreamingId]);

  const getSlotList = useCallback(() => {
    dispatch(livestreamingSlotListOperations.get());
  }, [dispatch]);

  const getCastList = useCallback(() => {
    dispatch(castListOperations.get());
  }, [dispatch]);

  const updateStatus = useCallback(
    (status: LivestreamingStatus, shouldStartRecording: boolean) => {
      const slotId = livestreamingSlot?.encoder?.streamkey;
      if (!slotId) {
        enqueueSnackbar('スロット情報を取得できませんでした', {
          variant: 'error',
        });
        return;
      }

      if (confirm('ライブ配信のステータスを更新します')) {
        dispatch(
          livestreamingOperations.updateStatus(
            livestreamingId,
            status,
            slotId,
            shouldStartRecording,
            () => {
              get();
              enqueueSnackbar(
                `ライブ配信を${
                  status === LivestreamingStatus.Streaming
                    ? '開始しました'
                    : '終了しました'
                }`,
                {
                  variant: 'info',
                },
              );
              status === LivestreamingStatus.Finished &&
                setIsFinishedModalOpened(true);
            },
            (errorMessage: string) => {
              enqueueSnackbar(errorMessage, {
                variant: 'error',
              });
            },
          ),
        );
      }
    },
    [dispatch, enqueueSnackbar, livestreamingId, livestreamingSlot, get],
  );

  const updateCastId = useCallback(
    (castId: string) => {
      dispatch(
        livestreamingOperations.updateCastId(
          livestreamingId,
          castId,
          () => {
            get();
            enqueueSnackbar('配信キャストを更新しました', {
              variant: 'info',
            });
          },
          () => {
            enqueueSnackbar('配信キャストの更新に失敗しました', {
              variant: 'error',
            });
          },
        ),
      );
    },
    [dispatch, enqueueSnackbar, livestreamingId, get],
  );

  const updateLivestreamingInfo = useCallback(
    (slot: LivestreamingSlot) => {
      if (livestreaming) {
        dispatch(
          livestreamingOperations.updateLivestreamingInfo(
            livestreaming,
            slot,
            () => {
              get();
            },
            () => {
              enqueueSnackbar('スロットの更新に失敗しました', {
                variant: 'error',
              });
            },
          ),
        );
      }
    },
    [dispatch, enqueueSnackbar, livestreaming, get],
  );

  const updateVideoConfig = useCallback(
    (params: UpdateVideoConfigParams) => {
      dispatch(
        livestreamingOperations.updateVideoConfig(
          livestreamingId,
          params,
          () => {
            get();
            enqueueSnackbar('アーカイブ設定を更新しました', {
              variant: 'info',
            });
          },
          () => {
            enqueueSnackbar('アーカイブ設定の更新に失敗しました', {
              variant: 'error',
            });
          },
        ),
      );
    },
    [dispatch, enqueueSnackbar, livestreamingId, get],
  );

  useEffect(() => {
    if (livestreaming === null || livestreamingId !== livestreaming.id) {
      get();
      getSlotList();
    }
    getCastList();
  }, [get, getSlotList, livestreaming, livestreamingId, getCastList]);

  useEffect(() => {
    if (livestreamingSlot && livestreaming) {
      if (
        !livestreamingInfo ||
        !shallowEqualInfoAndSlot(livestreamingInfo, livestreamingSlot)
      ) {
        updateLivestreamingInfo(livestreamingSlot);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livestreamingSlot, updateLivestreamingInfo]);

  const handleOpenSlotEditModal = (name: string) => {
    const livestreamingSlot = livestreamingSlots.find(
      (slot) => slot.name === name,
    );
    if (livestreamingSlot) {
      setTargetSlot(livestreamingSlot);
      setIsSlotEditModalOpened(true);
    }
  };

  const deleteLiveStreaming = useCallback(() => {
    dispatch(
      livestreamingOperations.deleteLivestreaming(
        livestreamingId,
        () => {
          enqueueSnackbar('ライブ配信を削除しました', {
            variant: 'success',
          });
          router.push('/admin/livestreaming/list');
        },
        (errorMessage: string) => {
          enqueueSnackbar(`ライブ配信の削除に失敗しました: ${errorMessage}`, {
            variant: 'error',
          });
        },
      ),
    );
  }, [dispatch, enqueueSnackbar, livestreamingId, router]);

  const onClickChatWindowOpen = useCallback(() => {
    window.open(
      `/livestreaming/live_chat?id=${livestreamingId}`,
      'livechat',
      'width=575,height=615menubar=no,location=no,status=no,',
    );
  }, [livestreamingId]);

  return (
    <AdminTemplate
      isLoading={isFetching}
      goBackOption={{
        href: '/admin/livestreaming/list',
        as: '/admin/livestreaming/list',
        label: '一覧に戻る',
      }}
    >
      {livestreaming && livestreamingPassword && (
        <div className={classes.container}>
          <div className={classes.header}>
            <Typography variant="h2" className={classes.title}>
              ライブ配信
            </Typography>
            <div>
              <Button
                variant="outlined"
                color="default"
                onClick={onClickChatWindowOpen}
                startIcon={<LaunchIcon />}
                className={classes.chatPopupButton}
              >
                チャット
              </Button>
              {livestreaming.status === LivestreamingStatus.Scheduled && (
                <Badge
                  variant="dot"
                  badgeContent={isReadyForStreaming && 0}
                  color="error"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <Tooltip
                    placement="bottom-end"
                    title={
                      isReadyForStreaming ? (
                        ''
                      ) : (
                        <>
                          <p>以下の理由で配信を開始できません．</p>
                          <ul>
                            {!hasSetVideoConfig && (
                              <li>
                                「アーカイブ設定」が設定・保存されていません．
                              </li>
                            )}
                            {!hasSetInfo && (
                              <li>「スロット」が適用されていません</li>
                            )}
                          </ul>
                        </>
                      )
                    }
                  >
                    <span>
                      <Button
                        variant="contained"
                        color="primary"
                        aria-describedby="warningPopper"
                        disabled={!isReadyForStreaming || isUpdatingLive}
                        onClick={() =>
                          updateStatus(
                            LivestreamingStatus.Streaming,
                            livestreaming.shouldStartRecording,
                          )
                        }
                        startIcon={
                          isUpdatingLive ? (
                            <CircularProgress size={16} />
                          ) : (
                            <VideoCallIcon />
                          )
                        }
                      >
                        ライブ配信を開始
                      </Button>
                    </span>
                  </Tooltip>
                </Badge>
              )}
              {livestreaming.status === LivestreamingStatus.Streaming && (
                <Button
                  variant="contained"
                  className={classes.stopButton}
                  onClick={() =>
                    updateStatus(
                      LivestreamingStatus.Finished,
                      livestreaming.shouldStartRecording,
                    )
                  }
                  disabled={isUpdatingLive}
                  startIcon={
                    isUpdatingLive ? (
                      <CircularProgress size={16} />
                    ) : (
                      <VideoCallIcon />
                    )
                  }
                >
                  ライブ配信を終了
                </Button>
              )}
              {livestreaming.status === LivestreamingStatus.Finished && (
                <Button variant="contained" disabled={true}>
                  配信終了済み
                </Button>
              )}
            </div>
          </div>
          <LivestreamingPageTop
            livestreaming={livestreaming}
            livestreamingInfo={livestreamingInfo}
            livestreamingPassword={livestreamingPassword}
            onClickEdit={() => setIsEditModalOpened(true)}
          />
          <div className={classes.spacer} />
          <Grid container spacing={2}>
            <Grid item md={12} lg={8}>
              <LivestreamingSlotSelector
                isLoading={isFetchingSlot || isCreatingSlot || isUpdatingSlot}
                currentSlot={livestreamingSlot}
                livestreamingSlots={livestreamingSlots}
                onClickChangeSlot={(slot: LivestreamingSlot) => {
                  if (confirm('スロットを適用しますか？')) {
                    setLivestreamingSlot(slot);
                  }
                }}
                onClickCreateSlot={() => setIsSlotCreateModalOpened(true)}
                onClickEditSlot={(name: string) =>
                  handleOpenSlotEditModal(name)
                }
              />
            </Grid>
            <Grid item md={12} lg={4}>
              <LivestreamingCastSelector
                casts={castList}
                currentCastId={livestreaming.castId ?? ''}
                onChangeCast={(castId: string) => updateCastId(castId)}
              />
              <div style={{ marginTop: '16px' }} />
              <LivestreamingVideoConfigForm
                livestreaming={livestreaming}
                isUpdating={isUpdatingLive}
                updateVideoConfig={updateVideoConfig}
              />
            </Grid>
            <Grid item md={12} className={classes.dangerArea}>
              <Button
                variant="contained"
                onClick={() => setIsDeleteModalOpen(true)}
                className={classes.deleteButton}
                disabled={
                  livestreaming?.status !== LivestreamingStatus.Scheduled ||
                  isUpdatingLive ||
                  user?.role === 'cast'
                }
              >
                配信の削除
              </Button>
            </Grid>
          </Grid>
          <LivestreamingEditModal
            livestreaming={livestreaming}
            livestreamingPassword={livestreamingPassword}
            isOpened={isEditModalOpened}
            handleClose={() => setIsEditModalOpened(false)}
          />
          <LivestreamingSlotCreateModal
            isOpened={isSlotCreateModalOpened}
            handleClose={() => setIsSlotCreateModalOpened(false)}
          />
          {targetSlot && (
            <LivestreamingSlotEditModal
              livestreamingSlot={targetSlot}
              isOpened={isSlotEditModalOpened}
              handleClose={() => {
                setTargetSlot(undefined);
                setIsSlotEditModalOpened(false);
              }}
            />
          )}
        </div>
      )}
      <ConfirmModal
        isOpened={isDeleteModalOpen}
        title={'ライブ配信を削除'}
        content={`本当にライブ配信「${livestreaming?.title}」を削除しますか？`}
        onConfirm={deleteLiveStreaming}
        onClose={() => setIsDeleteModalOpen(false)}
        confirmText={'削除する'}
        cancelText={'キャンセル'}
        isLoading={isDeleting}
        isDisabled={isDeleting}
      />
      <ConfirmModal
        isOpened={isFinishedModalOpened}
        title={'ライブ配信終了'}
        content={
          'こちらのライブ配信は終了されました。もう一度ライブ配信を開始する場合は新たに配信枠を作成してください'
        }
        onConfirm={() => setIsFinishedModalOpened(false)}
        onClose={() => setIsFinishedModalOpened(false)}
        confirmText={'OK'}
      />
    </AdminTemplate>
  );
};

export default AdminLivestreamingPage;
