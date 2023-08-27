import { boxShadow } from '@/config/ui';
import { Theme, makeStyles } from '@material-ui/core';

const HEADER_HEIGHT = 64;
const HEADER_HEIGHT_SM = 0;
const FOOTER_HEIGHT = 242;

const useOutlineStyles = makeStyles<
  Theme,
  {
    playerHeight: number;
    windowHeight: number;
    isVertical: boolean;
    wasLivestreaming?: boolean;
  }
>((theme) => ({
  loader: {
    margin: '64px auto',
    paddingTop: '32px',
    textAlign: 'center',
  },
  container: {
    maxWidth: '1800px',
    [theme.breakpoints.up('md')]: {
      margin: `${HEADER_HEIGHT}px auto 0`,
      padding: theme.spacing(2, 4),
      height: 'inherit',
      minHeight: `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)`,
    },
    [theme.breakpoints.down('sm')]: {
      margin: `${HEADER_HEIGHT_SM}px auto 0`,
      padding: theme.spacing(0),
      height: ({ isVertical, windowHeight }) =>
        isVertical
          ? `calc(${windowHeight}px - ${HEADER_HEIGHT_SM}px)`
          : 'inherit',
    },
  },
  mainContainer: {
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(0, 2),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0),
    },
  },
  playerContainer: {
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    [theme.breakpoints.up('md')]: {
      top: 0,
      height: 'inherit',
      positon: 'inherit',
    },
    [theme.breakpoints.down('sm')]: {
      top: `${HEADER_HEIGHT_SM}px`,
      height: 'calc(100vw * 9 / 16)',
      position: ({ isVertical }) => (isVertical ? 'fixed' : 'initial'),
    },
  },
  playerSpacer: {
    [theme.breakpoints.up('md')]: {
      paddingTop: '0',
    },
    [theme.breakpoints.down('sm')]: {
      paddingTop: 'calc(100vw * 9 / 16)',
    },
  },
  bottomWrapper: {
    left: 0,
    right: 0,
    bottom: 0,
    [theme.breakpoints.up('md')]: {
      top: 0,
      height: 'inherit',
      positon: 'inherit',
    },
    [theme.breakpoints.down('sm')]: {
      top: ({ isVertical }) => (isVertical ? 'calc((100vw * 9 / 16))' : 0),
      position: ({ isVertical }) => (isVertical ? 'fixed' : 'inherit'),
    },
  },
  bottomContainer: {
    borderRadius: '12px',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3, 0),
      height: 'inherit',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 0),
      height: ({ isVertical, windowHeight }) =>
        isVertical
          ? `calc(${windowHeight}px - (100vw * 9 / 16) - ${HEADER_HEIGHT_SM}px)`
          : 'inherit',
    },
  },
  infoContainer: {
    boxShadow: boxShadow.default,
    borderRadius: '12px',
  },
  sideContainer: {
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(0, 2),
      display: 'block',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0),
      display: 'none',
    },
  },
  chatContainer: {
    borderRadius: '12px',
    zIndex: 100,
    [theme.breakpoints.up('md')]: {
      height: ({ playerHeight, wasLivestreaming }) =>
        wasLivestreaming ? `${playerHeight}px` : 'auto',
      boxShadow: boxShadow.default,
    },
    [theme.breakpoints.down('sm')]: {
      height: ({ wasLivestreaming }) => (wasLivestreaming ? '100%' : 'auto'),
    },
  },
}));

export default useOutlineStyles;
