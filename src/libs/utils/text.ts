export const copyToClipboard = (text: string, callback?: () => void) => {
  if (navigator && navigator.clipboard) {
    navigator.clipboard.writeText(text);
    callback && callback();
  }
};
