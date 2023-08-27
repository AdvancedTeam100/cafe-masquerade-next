/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Theme, makeStyles } from '@material-ui/core/styles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import SeekBar from '@/components/video/SeekBar';
import AudioVolume from '@/components/video/AudioVolume';
import ConfigMenu from '@/components/video/ConfigMenu';
import { colors } from '@/config/ui';
import { getTimeFromSeconds } from '@/libs/utils/dateFormat';
import {
  checkIsFullScreen,
  exitFullScreen,
  requestFullScreen,
} from '@/libs/utils/fullscreen';
import { checkIsMobileDevice } from '@/libs/utils/navigator';
import { useCookies } from 'react-cookie';

const useStyles = makeStyles<Theme, { hasBorderRadius: boolean }>((theme) => ({
  fullScreenParent: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    background: 'black',
    zIndex: 10000,
  },
  nonFullScreenParent: {},
  loader: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#00000060',
    '& svg': {
      color: 'white',
    },
    [theme.breakpoints.up('md')]: {
      borderRadius: ({ hasBorderRadius }) =>
        hasBorderRadius ? '12px !important' : '0px',
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: '0px',
    },
  },
  wrapper: {
    height: '128px',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    background: `linear-gradient(0deg, ${colors.video.controlBackground}, transparent)`,
    backgroundFilter: 'blur',
    [theme.breakpoints.up('md')]: {
      borderRadius: ({ hasBorderRadius }) =>
        hasBorderRadius ? '12px !important' : '0px',
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: '0px',
    },
  },
  controllerTopGradient: {
    height: '80px',
  },
  controller: {
    height: '48px',
    margin: '0 4px',
  },
  seekBarContainer: {
    height: '4px',
  },
  bottomController: {
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '44px',
    '& span': {
      color: colors.video.actionIcon,
      fontSize: '12px',
    },
  },
  actionIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    height: '44px',
    width: '44px',
    '& svg': {
      height: '32px',
      width: '32px',
      color: colors.video.actionIcon,
      '&:hover': {
        color: colors.video.actionIconHover,
      },
    },
  },
}));

export type Quality = number | 'auto';

type Props = {
  video: HTMLVideoElement | null;
  parent?: HTMLDivElement | null; // フルスクリーン時に必要
  qualities: Quality[];
  currentQuality: Quality;
  setQuality: (quality: Quality) => void;
  autoplay?: boolean;
  muted?: boolean;
  hasBorderRadius?: boolean;
};

const VideoController: React.FC<Props> = ({
  video,
  parent,
  qualities,
  currentQuality,
  setQuality,
  autoplay = false,
  muted = false,
  hasBorderRadius = true,
}) => {
  const classes = useStyles({ hasBorderRadius });
  const ui = useRef({
    isOnPlayer: false,
    isOnControl: false,
    shouldDisplayed: true,
    timeoutId: setTimeout(() => {}, 3000),
    hasSettingApplied: false,
  }).current;

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isLoading, setIsLoading] = useState(video === null);
  const [isOpenConfigMenu, setIsOpenConfigMenu] = useState(false);

  const [_, setCookies] = useCookies();

  useEffect(() => {
    ui.isOnControl = true;
    ui.timeoutId = setTimeout(() => {
      if (ui.shouldDisplayed) ui.shouldDisplayed = false;
    }, 5000);
  }, []);

  const updateShouldDisplayed = useCallback(() => {
    if (video?.paused) {
      ui.shouldDisplayed = true;
    } else if (ui.isOnPlayer || ui.isOnControl) {
      ui.shouldDisplayed = true;

      clearTimeout(ui.timeoutId);
      ui.timeoutId = setTimeout(() => {
        if (ui.shouldDisplayed) ui.shouldDisplayed = false;
      }, 3000);
    } else {
      ui.shouldDisplayed = false;
    }
  }, [ui.isOnPlayer, ui.isOnControl, video?.paused]);

  const toggleVideoPlaying = () => {
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  useEffect(() => {
    if (!video) return;
    // video API: http://www.htmq.com/video/

    const durationchangeEvent = () => setDuration(video.duration ?? 0);
    const timeupdateEvent = () => setCurrentTime(video.currentTime);
    const progressEvent = () => {
      if (video.buffered.length > 0 && video.readyState === 4) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered(bufferedEnd);
      }
    };

    // 動画の時間、再生中時間の取得、読み込み完了時間
    video.addEventListener('durationchange', durationchangeEvent);
    video.addEventListener('timeupdate', timeupdateEvent);
    video.addEventListener('progress', progressEvent);

    const setIsLoadingTrue = () => setIsLoading(true);
    const setIsLoadingFalse = () => setIsLoading(false);
    const setIsOnPlayerTrue = () => (ui.isOnPlayer = true);
    const setIsOnPlayerFalse = () => (ui.isOnPlayer = false);
    const canplayEventListener = () => {
      setIsLoading(false);
      if (ui.hasSettingApplied) return;

      video.muted = muted;
      if (autoplay) video.play();
      ui.hasSettingApplied = true;
    };

    // ローディング制御
    video.addEventListener('loadstart', setIsLoadingTrue);
    video.addEventListener('waiting', setIsLoadingTrue);
    video.addEventListener('canplay', canplayEventListener);
    video.addEventListener('playing', setIsLoadingFalse);

    // コントローラ表示制御
    video.addEventListener('mouseenter', setIsOnPlayerTrue);
    video.addEventListener('mouseleave', setIsOnPlayerFalse);
    video.addEventListener('mousemove', updateShouldDisplayed);
    video.addEventListener('touchend', updateShouldDisplayed);

    // 動画の再生制御
    if (!checkIsMobileDevice()) {
      video.addEventListener('click', toggleVideoPlaying);
    }

    video.oncontextmenu = () => false;

    return () => {
      // 動画の時間、再生中時間の取得、読み込み完了時間
      video.removeEventListener('durationchange', durationchangeEvent);
      video.removeEventListener('timeupdate', timeupdateEvent);
      video.removeEventListener('progress', progressEvent);

      // ローディング制御
      video.removeEventListener('loadstart', setIsLoadingTrue);
      video.removeEventListener('waiting', setIsLoadingTrue);
      video.removeEventListener('canplay', canplayEventListener);
      video.removeEventListener('playing', setIsLoadingFalse);

      // コントローラ表示制御
      video.removeEventListener('mouseenter', setIsOnPlayerTrue);
      video.removeEventListener('mouseleave', setIsOnPlayerFalse);
      video.removeEventListener('mousemove', updateShouldDisplayed);
      video.removeEventListener('touchend', updateShouldDisplayed);

      // 動画の再生制御
      if (!checkIsMobileDevice()) {
        video.removeEventListener('click', toggleVideoPlaying);
      }
    };
  }, [video]);

  const onChangeCurrentTime = (time: number) => {
    if (!video) return;
    video.currentTime = time;
  };

  const onChangeVolume = (volume: number) => {
    if (!video) return;
    video.volume = volume / 100;
    if (volume === 0) {
      video.muted = true;
    } else {
      video.muted = false;
    }
  };

  const toggleMuted = () => {
    if (!video) return;
    video.muted = !video.muted;
    setCookies('muted', video.muted);
  };

  const onChangePlaybackRate = (playbackRate: number) => {
    if (!video) return;
    video.playbackRate = playbackRate;
  };

  useEffect(() => {
    if (ui.isOnPlayer || ui.isOnControl) return;
    ui.shouldDisplayed = false;
    clearTimeout(ui.timeoutId);
  }, [ui.isOnPlayer, ui.isOnControl]);

  const onClickRequestFullScreen = () => {
    document.body.style.backgroundColor = 'black';
    document.body.style.overflow = 'hidden';

    if (checkIsMobileDevice() && video) {
      requestFullScreen(video);
    } else if (parent) {
      requestFullScreen();
      parent.className = classes.fullScreenParent ?? '';
    }
  };

  const onClickExitFullScreen = () => {
    document.body.style.backgroundColor = 'inherit';
    document.body.style.overflow = 'auto';

    if (!parent) return;
    exitFullScreen();
    parent.className = classes.nonFullScreenParent ?? '';
  };

  return (
    <>
      {isLoading && (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      )}
      {video && ui.shouldDisplayed && (
        <div
          className={classes.wrapper}
          onMouseEnter={() => {
            ui.isOnControl = true;
          }}
          onMouseLeave={() => {
            ui.isOnControl = false;
          }}
          onMouseMove={updateShouldDisplayed}
        >
          <div
            className={classes.controllerTopGradient}
            onClick={toggleVideoPlaying}
          />
          <div className={classes.controller}>
            <div className={classes.seekBarContainer}>
              <SeekBar
                duration={duration}
                buffered={buffered}
                currentTime={currentTime}
                onChangeCurrentTime={onChangeCurrentTime}
                isLoading={isLoading}
                ui={ui}
              />
            </div>
            <div className={classes.bottomController}>
              <div className={classes.actionContainer}>
                <Tooltip
                  title={video.paused ? '再生' : '一時停止'}
                  placement="top"
                >
                  <div
                    className={classes.actionIcon}
                    onClick={toggleVideoPlaying}
                  >
                    {video.paused ? <PlayArrowIcon /> : <PauseIcon />}
                  </div>
                </Tooltip>
                <AudioVolume
                  currentVolume={video.volume * 100}
                  isMuted={video.muted}
                  onChangeVolume={onChangeVolume}
                  toggleMuted={toggleMuted}
                />
                <span>{getTimeFromSeconds(currentTime)}</span>
                <span style={{ margin: '0 4px' }}>/</span>
                <span>{getTimeFromSeconds(duration)}</span>
              </div>
              <div className={classes.actionContainer}>
                <Tooltip title={isOpenConfigMenu ? '' : '設定'} placement="top">
                  <div className={classes.actionIcon}>
                    <ConfigMenu
                      qualities={qualities}
                      currentQuality={currentQuality}
                      currentPlaybackRate={video.playbackRate}
                      setQuality={setQuality}
                      setPlaybackRate={onChangePlaybackRate}
                      toggleConfigTooltip={(isOpen: boolean) =>
                        setIsOpenConfigMenu(isOpen)
                      }
                    />
                  </div>
                </Tooltip>
                {parent &&
                  (checkIsFullScreen() ? (
                    <Tooltip title={'フルスクリーン解除'} placement="top">
                      <div
                        className={classes.actionIcon}
                        onClick={onClickExitFullScreen}
                      >
                        <FullscreenExitIcon />
                      </div>
                    </Tooltip>
                  ) : (
                    <Tooltip title={'フルスクリーン'} placement="top">
                      <div
                        className={classes.actionIcon}
                        onClick={onClickRequestFullScreen}
                      >
                        <FullscreenIcon />
                      </div>
                    </Tooltip>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoController;
