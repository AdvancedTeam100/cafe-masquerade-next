declare global {
  interface Document {
    cancelFullscreen?: () => Promise<void>;
    mozCancelFullscreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    webkitCancelFullscreen?: () => Promise<void>;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitFullscreenElement?: Element;
    webkitCurrentFullScreenElement?: Element;
  }

  interface HTMLElement {
    msRequestFullscreen?: () => Promise<void>;
    mozRequestFullscreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
    webkitEnterFullscreen?: () => Promise<void>;
  }
}

export const checkIsFullScreen = () => {
  if (!document) return false;
  if (
    (document.fullscreenElement !== undefined &&
      document.fullscreenElement !== null) || // HTML5 標準
    (document.mozFullScreenElement !== undefined &&
      document.mozFullScreenElement !== null) || // Firefox
    (document.webkitFullscreenElement !== undefined &&
      document.webkitFullscreenElement !== null) || // Chrome・Safari
    (document.webkitCurrentFullScreenElement !== undefined &&
      document.webkitCurrentFullScreenElement !== null) || // Chrome・Safari (old)
    (document.msFullscreenElement !== undefined &&
      document.msFullscreenElement !== null)
  ) {
    return true;
  } else {
    return false;
  }
};

export const requestFullScreen = (
  htmlElement: HTMLElement = document.documentElement,
) => {
  if (htmlElement.requestFullscreen) {
    htmlElement.requestFullscreen();
  } else if (htmlElement.webkitRequestFullscreen) {
    htmlElement.webkitRequestFullscreen();
  } else if (htmlElement.webkitEnterFullscreen) {
    htmlElement.webkitEnterFullscreen();
  } else if (htmlElement.mozRequestFullscreen) {
    htmlElement.mozRequestFullscreen();
  } else if (htmlElement.msRequestFullscreen) {
    htmlElement.msRequestFullscreen();
  }
};

export const exitFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.cancelFullscreen) {
    document.cancelFullscreen();
  } else if (document.mozCancelFullscreen) {
    document.mozCancelFullscreen();
  } else if (document.webkitCancelFullscreen) {
    document.webkitCancelFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};
