import * as React from 'react';

type Props = {
  trackId: string;
};

const GoogleAnalyticsScript = ({ trackId }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${trackId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackId}', {
              page_path: window.location.pathname,
            });
            `,
        }}
      />
    </React.Fragment>
  );
};

export default GoogleAnalyticsScript;
