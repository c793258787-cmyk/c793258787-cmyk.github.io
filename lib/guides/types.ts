export const guideCategories = ["练级", "职业", "装备", "活动", "综合"] as const;

export type GuideCategory = (typeof guideCategories)[number];

export type GuidePost = {
  slug: string;
  title: string;
  excerpt: string;
  category: GuideCategory;
  tags: string[];
  publishedAt: string;
  author: string;
  cover?: string;
  douyinUrl?: string;
  body: string;
};

export type GuidePostMeta = Omit<GuidePost, "body">;
