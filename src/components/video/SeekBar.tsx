import { FC, useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import MuiSlider from '@material-ui/core/Slider';
import MuiLinearProgress from '@material-ui/core/LinearProgress';
import { getTimeFromSeconds } from '@/libs/utils/dateFormat';
import { colors } from '@/config/ui';
import { useEnableTouchScreen } from '@/hooks/enableTouchScreen';

const useStyles = makeStyles(() => ({
  container: {
    height: '100%',
    position: 'relative',
  },
}));

const Slider = withStyles({
  root: {
    color: colors.video.seekBar,
    height: '4px',
    position: 'absolute',
    top: 0,
    padding: 0,
  },
  thumb: {
    height: '12px',
    width: '12px',
    backgroundColor: colors.video.seekBar,
    marginTop: '-4px',
    '&:focus, &:hover, &:active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: '4px',
    border: '1px',
  },
  rail: {
    height: '4px',
    border: '1px',
    backgroundColor: colors.video.seekBarBackground,
    opacity: 1,
  },
})(MuiSlider);

const LinearProgress = withStyles({
  root: {
    height: '3px',
  },
  barColorPrimary: {
    backgroundColor: colors.video.seekBar,
  },
  colorPrimary: {
    backgroundColor: colors.video.seekBarBuffer,
  },
  buffer: {
    backgroundColor: colors.video.seekBarBackground,
  },
  dashed: {
    display: 'none',
  },
})(MuiLinearProgress);

const SliderValueTooltip = ({
  children,
  open,
  value,
}: {
  children: React.ReactElement;
  open: boolean;
  value: number;
}) => (
  <Tooltip
    open={open}
    enterTouchDelay={0}
    placement="top"
    title={getTimeFromSeconds(value)}
  >
    {children}
  </Tooltip>
);

type Props = {
  currentTime: number;
  duration: number;
  buffered: number;
  onChangeCurrentTime: (value: number) => void;
  isLoading: boolean;
  ui: {
    isOnPlayer: boolean;
    isOnControl: boolean;
    shouldDisplayed: boolean;
    timeoutId: NodeJS.Timeout;
  };
};

const SeekBar: FC<Props> = ({
  currentTime,
  duration,
  buffered,
  onChangeCurrentTime,
  isLoading,
  ui,
}) => {
  const [isOnSeekBar, setIsOnSeekBar] = useState(false);
  const [editingValue, setEditingValue] = useState<number>();
  const classes = useStyles();

  const { isEnableTouchScreen } = useEnableTouchScreen();

  useEffect(() => {
    if (!isLoading) {
      setEditingValue(undefined);
    }
  }, [isLoading]);

  const setTimeoutHidingSeek = () => {
    setIsOnSeekBar(true);
    clearTimeout(ui.timeoutId);
    ui.timeoutId = setTimeout(() => {
      setIsOnSeekBar(false);
      if (ui.shouldDisplayed) ui.shouldDisplayed = false;
    }, 3000);
  };

  return (
    <div
      className={classes.container}
      onMouseEnter={() => setIsOnSeekBar(true)}
      onMouseLeave={() => setIsOnSeekBar(false)}
      onTouchStart={setTimeoutHidingSeek}
      onTouchMove={setTimeoutHidingSeek}
      onTouchEnd={setTimeoutHidingSeek}
    >
      {isOnSeekBar || isEnableTouchScreen ? (
        <Slider
          ValueLabelComponent={SliderValueTooltip}
          valueLabelDisplay={isEnableTouchScreen ? 'auto' : 'on'}
          defaultValue={currentTime}
          value={editingValue ?? currentTime}
          onChange={(_, value) => setEditingValue(value as number)}
          onChangeCommitted={(_, value) => {
            onChangeCurrentTime(value as number);
          }}
          max={duration}
        />
      ) : (
        <LinearProgress
          variant="buffer"
          value={((editingValue ?? currentTime) / duration) * 100 || 0}
          valueBuffer={(buffered / duration) * 100 || 0}
        />
      )}
    </div>
  );
};

export default SeekBar;
