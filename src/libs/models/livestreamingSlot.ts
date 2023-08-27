export type LivestreamingSlot = {
  name: string;
  playbackUrl: {
    hls: string;
  };
  encoder: {
    username: string;
    password: string;
    streamkey: string;
    ingestUrl: {
      primary: string;
      backup: string;
    };
  };
  sharedSecret: string;
  createdAt: string;
};
