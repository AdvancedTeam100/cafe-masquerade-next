export type ContentSideLink = {
  title: string;
  href: string;
};

export type HomeContent = {
  sideLinks: ContentSideLink[];
  topImages: {
    url: string;
    href: string;
  }[];
  updatedAt: string;
  reviewTweetIds?: string[];
  castsTweetIds?: string[];
};

export type AboutContent = {
  contents: {
    title: string;
    subTitle: string;
    content: string;
  }[];
  updatedAt: string;
};

export type ContentId = 'home' | 'about';

export type Content = HomeContent | AboutContent;
