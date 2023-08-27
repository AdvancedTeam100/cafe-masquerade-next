import { useEffect } from 'react';

export const useTwitterScriptTag = (): void => {
  useEffect(() => {
    const tweet = document.createElement('script');
    tweet.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    tweet.setAttribute('defer', 'true');
    document.head.appendChild(tweet);
  }, []);
};
