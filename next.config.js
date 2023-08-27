module.exports = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'i.ytimg.com',
      'cdn.discordapp.com',
    ],
  },
  async redirects() {
    return [
      {
        source: '/recruit',
        destination: '/404',
        permanent: false,
      },
    ];
  },
};
