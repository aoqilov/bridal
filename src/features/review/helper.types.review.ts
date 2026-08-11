// ================================================================
// Mijozlar sharhlari — rasm + belgilangan tovar
// ================================================================

export type ReviewAuthor = {
  id: string;
  name: string;
  avatar?: string;
  city?: string;
};

export type Review = {
  id: string;
  /** Sharhda belgilangan tovar — `CatalogItem.id` */
  itemId: string;
  author: ReviewAuthor;
  /** 1..5 */
  rating: number;
  /** Sharh sarlavhasi */
  title: string;
  description?: string;
  /** Mijoz olgan rasmlar, kamida bitta */
  images: string[];
  createdAt: string; // ISO string
  likeCount?: number;
  /** Tasdiqlangan xarid */
  isVerifiedPurchase?: boolean;
};
