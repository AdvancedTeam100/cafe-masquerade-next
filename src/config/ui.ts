import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { Shadows } from '@material-ui/core/styles/shadows';

export const APP_MAX_WIDTH = 1200;
export const FOOTER_MAX_WIDTH = 900;

export const sidebarWidth = 240;
export const smallSidebarWidth = 72;

export const boxShadow = {
  default: '2px 2px 5px 0 rgba(119, 75, 67, 0.2)',
};

export const colors = {
  blue: '#2691ff',
  pink: '#E97482',
  hoverPink: '#F2AEB4',
  lightPink: '#F8B5BD',
  vividPink: '#FF9999',
  darkPink: '#D47999',
  darkYellow: '#F9A825',
  green: '#28a745',
  lightGreen: '#BAD9D0',
  gold: '#A59E86',
  youtubeRed: '#FF0000',
  twitterBlue: '#1b95e0',
  discordPurple: '#7189DA',

  gray: '#EBE9E5',
  darkGray: '#6E767A',
  semiDarkGray: '#B2B2AF',

  text: '#333',
  black: '#193342',

  linkText: '#E97482',
  linkTextBlue: '#4BACFF',
  footerLinkText: '#FFF4E3',

  brown: '#774B43',
  brownText: '#955E4B',
  darkBrown: '#4c2f2a',

  roleGold: '#DFD271',
  roleSilver: '#B4B4B4',
  roleBlonze: '#B97E4C',

  error: '#FF765D',

  border: '#FEE1C1',
  borderSecondary: '#F2DDD5',

  backgroundDark: '#291e1e',
  backgroundRed: '#B60401',
  backgroundLightBlue: '#91D2D9',
  backgroundYellow: '#FFFCEB',
  backgroundBrown: '#866667',
  backgroundWine: '#8C6568',
  backgroundWhite: '#fff',
  backgroundBeige: '#FAEFE3',
  backgroundFooter: '#8C6568',
  backgroundDarkGray: '#C5C5C5',

  // admin
  grayText: '#999',
  lightGrayText: '#ddd',
  backgroundGray: '#f8f8f8',
  backgroundGraySelected: '#eee',
  dangerRed: '#f44336',
  lightDangerRed: '#c62828',

  video: {
    controlBackground: '#000000a0',
    actionIcon: '#f1f1f1',
    actionIconHover: '#fff',
    seekBar: '#FF0000',
    seekBarBackground: '#c4c4c480',
    seekBarBuffer: '#c4c4c460',
  },
};

const defaultTheme = createMuiTheme({});
const shadows = [
  'none',
  boxShadow.default,
  boxShadow.default,
  ...defaultTheme.shadows.slice(3),
] as Shadows;

export const fontFamily = [
  'Noto Sans JP',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join(',');

// Create a theme instance.
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.blue,
      contrastText: '#fff',
    },
    secondary: {
      main: colors.lightPink,
    },
    error: {
      main: colors.error,
    },
    background: {
      default: colors.backgroundBeige,
      paper: colors.backgroundWhite,
    },
    text: {
      primary: colors.text,
      secondary: colors.lightGrayText,
      disabled: colors.semiDarkGray,
      hint: colors.green,
    },
    divider: colors.border,
  },
  props: {
    MuiButton: {
      disableElevation: true, // ボタンの shadow を非表示
    },
    MuiPaper: {
      style: {
        borderRadius: '12px',
      },
    },
  },
  shadows,
  typography: {
    fontFamily: fontFamily,
  },
});

export const adminTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.blue,
      contrastText: '#fff',
    },
    secondary: {
      main: colors.backgroundBeige,
    },
    error: {
      main: red.A400,
    },
    background: {
      default: colors.backgroundGray,
      paper: '#fff',
    },
    text: {
      primary: colors.text,
      secondary: colors.gold,
      disabled: colors.semiDarkGray,
      hint: colors.green,
    },
  },
  props: {
    MuiButton: {
      disableElevation: true,
    },
  },
  shadows,
  typography: {
    fontFamily: fontFamily,
  },
  overrides: {
    MuiOutlinedInput: {
      input: {
        padding: '14px 14px',
      },
    },
    MuiSelect: {
      outlined: {
        padding: '12px 14px',
      },
    },
    MuiFormLabel: {
      root: {
        marginBottom: '4px',
      },
    },
  },
});

export const button = {
  default: {
    margin: theme.spacing(1),
    borderRadius: '50px',
    backgroundColor: colors.brown,
    width: '88px',
    color: 'white',
    fontSize: '1.2rem',
    lineHeight: '1rem',
    padding: theme.spacing(1, 1),
    '&:hover': {
      backgroundColor: colors.darkBrown,
    },
  },
  gray: {
    margin: theme.spacing(1),
    borderRadius: '50px',
    backgroundColor: colors.semiDarkGray,
    width: '88px',
    color: 'white',
    fontSize: '1.2rem',
    lineHeight: '1rem',
    padding: theme.spacing(1, 1),
    '&:hover': {
      backgroundColor: colors.darkGray,
    },
  },
  pink: {
    margin: theme.spacing(1),
    backgroundColor: colors.vividPink,
    color: 'white',
    fontSize: '1rem',
    lineHeight: '1rem',
    fontWeight: 700,
    padding: theme.spacing(1, 2),
    '&:hover': {
      backgroundColor: colors.lightPink,
    },
  },
};

export const buttonSquare = {
  discord: {
    borderRadius: '6px',
    backgroundColor: colors.discordPurple,
    color: 'white',
    fontSize: '1rem',
    padding: theme.spacing(1, 1),
    '&:hover': {
      backgroundColor: colors.discordPurple,
      opacity: 0.8,
    },
  },
  pink: {
    borderRadius: '6px',
    backgroundColor: colors.vividPink,
    color: 'white',
    fontSize: '1rem',
    padding: theme.spacing(1, 1),
    '&:hover': {
      backgroundColor: colors.lightPink,
    },
  },
  gray: {
    borderRadius: '6px',
    backgroundColor: colors.backgroundDarkGray,
    color: 'white',
    fontSize: '1rem',
    padding: theme.spacing(1, 1),
    '&:hover': {
      backgroundColor: colors.backgroundDarkGray,
      opacity: 0.8,
    },
  },
  defaultOutlined: {
    border: `1px solid ${colors.semiDarkGray}`,
    borderRadius: '6px',
    backgroundColor: 'inherit',
    color: colors.semiDarkGray,
    fontSize: '1rem',
    padding: theme.spacing(1, 1),
    '&:hover': {
      backgroundColor: 'inherit',
      opacity: 0.8,
    },
  },
};

type GetVideoPlayerStyle = {
  volumeLeftSP?: string;
};
export const getVideoPlayerStyle = (props?: GetVideoPlayerStyle) => ({
  '& .video-js': {
    '-webkit-tap-highlight-color': '#00000000',
    '&:focus': {
      outline: 'none',
    },
  },
  '& video': {
    objectFit: 'inherit',
  },
  '& .vjs-loading-spinner': {
    display: 'block',
    opacity: 1,
    border: '4px solid transparent',
    margin: '-22px 0 0 -22px',
  },
  '& .vjs-loading-spinner:before': {
    borderColor: '#00000000',
    borderTopColor: '#00000000 !important',
  },
  '& .vjs-loading-spinner:after': {
    borderColor: '#ffffff',
    borderTopColor: '#00000000 !important',
  },
  '& .vjs-subs-caps-button': {
    display: 'none',
  },
  '& .vjs-big-play-centered .vjs-big-play-button': {
    top: 0,
    left: 0,
    marginTop: 0,
    marginLeft: 0,
    height: '100%',
    width: '100%',
    border: 'none',
    borderRadius: '8px',
    background: '#00000050',
    fontSize: '6em',
    '&:hover': {
      background: '#00000040',
    },
    '@media (max-width: 960px)': {
      borderRadius: '0px',
    },
  },
  '& .video-js .vjs-big-play-button .vjs-icon-placeholder:before': {
    position: 'inherit',
  },
  '.video-js .vjs-control-text': {
    display: 'none',
  },
  '& .video-js .vjs-control-bar': {
    '@media(min-width: 961px)': {
      height: '4em !important',
    },
    '@media(max-width: 960px)': {
      height: '100% !important',
    },
    backgroundColor: '#2e2e2e87',
  },
  '& .video-js .vjs-volume-panel.vjs-hover .vjs-volume-control.vjs-volume-horizontal, .video-js .vjs-volume-panel:active .vjs-volume-control.vjs-volume-horizontal, .video-js .vjs-volume-panel:focus .vjs-volume-control.vjs-volume-horizontal, .video-js .vjs-volume-panel .vjs-volume-control:active.vjs-volume-horizontal, .video-js .vjs-volume-panel.vjs-hover .vjs-mute-control ~ .vjs-volume-control.vjs-volume-horizontal, .video-js .vjs-volume-panel .vjs-volume-control.vjs-slider-active.vjs-volume-horizontal': {
    height: '4em !important',
    width: '5.5em !important',
  },
  '& .vjs-control': {
    '&:focus': {
      outline: 'none',
    },
  },
  '& .vjs-slider .vjs-slider-horizontal': {
    '&:focus': {
      outline: 'none !important',
    },
  },
  '& .video-js .vjs-play-control': {
    '@media(max-width: 960px)': {
      position: 'relative',
      width: 'auto',
      height: 'auto',
      margin: 'auto',
      '& .vjs-icon-placeholder:before': {
        position: 'relative !important',
        fontSize: '5em',
      },
    },
  },
  '& .video-js .vjs-play-progress': {
    backgroundColor: '#FF0000',
  },
  '& .video-js .vjs-play-progress:before': {
    color: '#FF0000',
  },
  '& .vjs-slider-horizontal .vjs-volume-level:before': {
    top: '-0.4em',
  },
  '& .video-js .vjs-volume-bar': {
    margin: '1.85em 0.45em',
  },
  '& .video-js .vjs-volume-panel': {
    '@media(max-width: 960px)': {
      position: 'absolute',
      bottom: 0,
      height: '40px',
      left: props?.volumeLeftSP ?? '12px',
      width: '44px',
      '&:hover .vjs-volume-horizontal, & .vjs-volume-horizontal': {
        display: 'none',
      },
    },
  },
  '& .video-js .vjs-current-time': {
    '@media(max-width: 960px)': {
      position: 'absolute',
      bottom: 0,
      height: '40px',
      left: '8px',
      width: '44px',
    },
  },
  '& .video-js .vjs-time-divider': {
    '@media(max-width: 960px)': {
      position: 'absolute',
      bottom: 0,
      height: '40px',
      left: '56px',
      width: '8px',
    },
  },
  '& .video-js .vjs-duration': {
    '@media(max-width: 960px)': {
      position: 'absolute',
      bottom: 0,
      height: '40px',
      left: '64px',
      width: '48px',
    },
  },
  '& .video-js .vjs-live-control': {
    fontSize: '1.2em',
    lineHeight: '3.4em',
    '@media(max-width: 960px)': {
      position: 'absolute',
      bottom: 0,
      height: '40px',
      left: '16px',
    },
  },
  '& .video-js .vjs-progress-control': {
    position: 'absolute',
    height: '10px',
    '&:focus': {
      outline: 'none',
    },
    '@media(min-width: 961px)': {
      bottom: '34px',
      left: '0',
      right: '0',
      width: '100%',
    },
    '@media(max-width: 960px)': {
      bottom: '14px',
      left: '160px',
      right: '52px',
      width: 'calc(100% - 160px - 52px)',
    },
  },
  '& .video-js .vjs-progress-control .vjs-progress-holder': {
    margin: '0 4px',
  },
  '& .video-js .vjs-time-control': {
    display: 'block',
    fontSize: '1.2em',
    lineHeight: '3.4em',
    minWidth: 'auto',
    width: 'auto',
    paddingLeft: '2px',
    paddingRight: '2px',
  },
  '& .video-js .vjs-remaining-time': {
    display: 'none',
  },
  '& .vjs-button > .vjs-icon-placeholder:before': {
    fontSize: '2.4em',
  },
  '& .vjs-menu-button-popup': {
    '&:focus': {
      outline: 'none',
    },
  },
  '& .vjs-menu-button-popup .vjs-menu': {
    width: '18em',
    left: '-7em',
    marginBottom: '2.4em',
  },
  '& .vjs-menu-button-popup .vjs-menu .vjs-menu-content': {
    backgroundColor: 'rgb(12 12 12 / 75%)',
    maxHeight: 'inherit',
  },
  '& .vjs-menu li.vjs-menu-title': {
    padding: '0.8em 3.2em',
    textAlign: 'left',
    borderBottom: '1px solid rgb(255 255 255 / 50%)',
  },
  '& .vjs-menu li.vjs-selected, .vjs-menu li.vjs-selected:focus, .vjs-menu li.vjs-selected:hover, .js-focus-visible .vjs-menu li.vjs-selected:hover': {
    backgroundColor: 'rgb(255 255 255 / 22%)',
    color: 'inherit',
  },
  '& .vjs-menu li': {
    padding: '0.6em 2.6em',
    textAlign: 'left',
    lineHeight: '1.8em',
    fontSize: '1.2em',
    '&:focus': {
      outline: 'none',
    },
  },
  '& .video-js .vjs-fullscreen-control': {
    position: 'absolute',
    right: '12px',
    '@media(max-width: 960px)': {
      right: '8px',
      bottom: 0,
      height: '40px',
    },
  },
  '& .video-js .vjs-picture-in-picture-control': {
    position: 'absolute',
    right: '52px',
    '@media(max-width: 960px)': {
      right: '8px',
      height: '40px',
    },
  },
  '& .video-quality-selector': {
    right: '92px',
    bottom: 0,
    height: '40px',
    width: '40px',
    position: 'absolute',
    '@media(max-width: 960px)': {
      right: '48px',
      top: 0,
    },
  },
});

export const editorColors = [
  // source: https://jpuri.github.io/react-draft-wysiwyg/#/docs
  'rgb(97,189,109)',
  'rgb(26,188,156)',
  'rgb(84,172,210)',
  'rgb(44,130,201)',
  'rgb(147,101,184)',
  'rgb(71,85,119)',
  'rgb(204,204,204)',
  'rgb(65,168,95)',
  'rgb(0,168,133)',
  'rgb(61,142,185)',
  'rgb(41,105,176)',
  'rgb(85,57,130)',
  'rgb(40,50,78)',
  'rgb(0,0,0)',
  'rgb(247,218,100)',
  'rgb(251,160,38)',
  'rgb(235,107,86)',
  'rgb(226,80,65)',
  'rgb(163,143,132)',
  'rgb(239,239,239)',
  'rgb(255,255,255)',
  'rgb(250,197,28)',
  'rgb(243,121,52)',
  'rgb(209,72,65)',
  'rgb(184,49,47)',
  'rgb(124,112,107)',
  'rgb(209,213,216)',
  colors.brown,
];
