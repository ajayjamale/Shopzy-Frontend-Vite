import type { HomeCategory } from './homeDataTypes';

export type HomeSectionKey =
  | 'HERO'
  | 'ELECTRONICS'
  | 'TOP_BRAND'
  | 'SHOP_BY_CATEGORY'
  | 'DEALS'
  | 'DAILY_DEALS';

export interface HomeContentItem {
  id: number;
  sectionKey: HomeSectionKey;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  badgeText?: string;
  redirectLink?: string;
  categoryId?: string;
  active: boolean;
  displayOrder: number;
}

export interface HomeSectionConfig {
  sectionKey: HomeSectionKey;
  sectionTitle?: string;
  visible: boolean;
  displayOrder: number;
}

export interface DealItem {
  id?: number;
  title?: string;
  subtitle?: string;
  discount?: number;
  discountLabel?: string;
  image?: string;
  imageUrl?: string;
  redirectLink?: string;
  category?: HomeCategory;
  active?: boolean;
  displayOrder?: number;
}

export interface DailyDiscountItem {
  id?: number;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  redirectLink?: string;
  discountLabel?: string;
  discountPercent?: number;
  active?: boolean;
  highlighted?: boolean;
  displayOrder?: number;
  startDate?: string;
  endDate?: string;
}

export interface HomePageContent {
  heroSlides: HomeContentItem[];
  electronics: HomeContentItem[];
  topBrands: HomeContentItem[];
  shopByCategories: HomeCategory[];
  dealCategories: HomeCategory[];
  deals: DealItem[];
  dailyDiscounts: DailyDiscountItem[];
  sections: HomeSectionConfig[];
}
