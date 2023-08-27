import { FC, useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import MuiSlider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import { colors } from '@/config/ui';

const useStyles = makeStyles(() => ({
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  iconButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    height: '100%',
    width: '44px',
    '& svg': {
      height: '24px',
      width: '24px',
      color: colors.video.actionIcon,
      '&:hover': {
        color: colors.video.actionIconHover,
      },
    },
  },
  slider: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    transition: 'margin .2s, width .2s',
    transitionTimingFunction: 'cubic-bezier(.4,0,1,1)',
  },

  '@keyframes show': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
}));

const Slider = withStyles({
  root: {
    color: colors.video.actionIcon,
    height: '4px',
  },
  thumb: {
    height: '10px',
    width: '10px',
    backgroundColor: colors.video.actionIcon,
    marginTop: '-3px',
    marginLeft: '-2px',
    '&:focus, &:hover, &:active': {
      boxShadow: 'inherit',
    },
  },
  track: {
    height: '3px',
    border: '1px',
  },
  rail: {
    height: '3px',
    border: '1px',
    backgroundColor: colors.video.seekBarBackground,
    opacity: 1,
  },
})(MuiSlider);

type Props = {
  currentVolume: number;
  isMuted: boolean;
  onChangeVolume: (value: number) => void;
  toggleMuted: () => void;
};

const AudioVolume: FC<Props> = ({
  currentVolume,
  isMuted,
  onChangeVolume,
  toggleMuted,
}) => {
  const [isOnAudioVolume, setIsOnAudioVolume] = useState(false);
  const [editingValue, setEditingValue] = useState<number>();
  const classes = useStyles();

  useEffect(() => {
    setEditingValue(undefined);
  }, [currentVolume]);

  return (
    <div
      className={classes.container}
      onMouseEnter={() => setIsOnAudioVolume(true)}
      onMouseLeave={() => setIsOnAudioVolume(false)}
    >
      <Tooltip title={isMuted ? 'ミュート解除' : 'ミュート'} placement="top">
        <div className={classes.iconButton} onClick={toggleMuted}>
          {isMuted ? (
            <VolumeOffIcon />
          ) : currentVolume > 50 ? (
            <VolumeUpIcon />
          ) : (
            <VolumeDownIcon />
          )}
        </div>
      </Tooltip>
      <div
        className={classes.slider}
        style={{
          width: isOnAudioVolume ? '52px' : '0px',
          marginRight: isOnAudioVolume ? '16px' : '4px',
        }}
      >
        {isOnAudioVolume && (
          <Slider
            defaultValue={isMuted ? 0 : currentVolume}
            value={isMuted ? 0 : editingValue ?? currentVolume}
            onChange={(_, value) => {
              setEditingValue(value as number);
            }}
            onChangeCommitted={(_, value) => {
              onChangeVolume(value as number);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AudioVolume;
