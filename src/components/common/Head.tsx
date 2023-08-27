import NextHead from 'next/head';

type Props = {
  title: string;
  keyword: string;
  image: string;
  url: string;
  description?: string;
  isNoIndex?: boolean;
  upgradeInsecureRequests?: boolean;
};

const Head = ({
  title,
  description = '当店は、（自称）世界で初にして唯一のバーチャルメイド喫茶です。 リアル世界にて、様々なストレスを抱えている皆様に、当店のメイドたちは 「いやし」と「いやらし」をお給仕いたします。',
  keyword,
  image,
  url,
  isNoIndex,
  upgradeInsecureRequests,
}: Props): JSX.Element => {
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keyword} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="blog" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@applet_cn" />
      <meta name="twitter:url" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={url} />
      {isNoIndex && <meta name="robots" content="noindex"></meta>}
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
      />
      {upgradeInsecureRequests && (
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      )}
    </NextHead>
  );
};

export default Head;
