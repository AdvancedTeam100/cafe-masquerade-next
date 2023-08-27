import '../style/editor.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { store } from '@/store';
import { SnackbarProvider } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { adminTheme, colors, theme } from '@/config/ui';
import { usePageView } from '@/hooks/gtag';
import AppContainer from '@/containers/common/AppContainer';

const useStyles = makeStyles(() => ({
  variantDefault: { backgroundColor: colors.backgroundLightBlue },
}));

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    jssStyles?.parentElement?.removeChild(jssStyles);
  }, []);

  usePageView();

  const router = useRouter();
  const isAdmin = router.pathname.includes('/admin');

  const classes = useStyles();

  return (
    <Provider store={store}>
      <StylesProvider injectFirst>
        <ThemeProvider theme={isAdmin ? adminTheme : theme}>
          <SnackbarProvider
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            className={classes.variantDefault}
          >
            <CssBaseline />
            <AppContainer>
              <Component {...pageProps} />
            </AppContainer>
          </SnackbarProvider>
        </ThemeProvider>
      </StylesProvider>
    </Provider>
  );
};

export default App;
