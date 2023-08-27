export const CastStatus = {
  Draft: 'Draft',
  Published: 'Published',
} as const;

export type CastStatus = typeof CastStatus[keyof typeof CastStatus];

export type PhysicalInformation = {
  height: number;
  weight: number;
  bustSize: number;
  waistSize: number;
  hipSize: number;
  cupSize: string;
};

export type SocialId = {
  twitter: string;
  twitcasting?: string | null;
  tiktok?: string | null;
  niconico?: string | null;
};

export type Cast = {
  id: string;
  name: string;
  description: string;
  selfIntroduction: string;
  livestreamingDescription?: string | null;
  physicalInformation: PhysicalInformation;
  imageUrl: string;
  status: CastStatus;
  tags: string[];
  youtubeChannelId: string;
  youtubeChannelIdSecond?: string | null;
  socialId: SocialId;
  notificationDiscordUrl: string | null;
  joinedAt: string;
  qa: {
    question: string;
    answer: string;
  }[];
  createdAt: string;
  updatedAt: string;
};
