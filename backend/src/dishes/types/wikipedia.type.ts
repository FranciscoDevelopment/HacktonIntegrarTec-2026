export type wikipediaPageT = {
  title: string;
  missing?: boolean;
  extract?: string;
  fullurl?: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
};

export type wikipediaQueryResponseT = {
  query?: {
    normalized?: { from: string; to: string }[];
    redirects?: { from: string; to: string }[];
    pages: wikipediaPageT[];
  };
};
