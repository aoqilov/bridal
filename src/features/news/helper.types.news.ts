export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  cover: string;
  excerpt: string;
  body: string;
  publishedAt: string; // ISO
  author?: string;
  tags?: string[];
};
