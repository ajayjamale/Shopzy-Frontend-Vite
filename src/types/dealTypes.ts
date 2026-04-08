export interface DailyDiscount {
  id?: number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  redirectLink?: string;
  discountLabel?: string;
  discountPercent: number;
  active?: boolean;
  highlighted?: boolean;
  displayOrder?: number;
  startDate?: string;
  endDate?: string;
}

export interface Deal {
  id?: number;
  discount?: number;
  category?: {
    id?: number;
    categoryId?: string;
    image?: string;
  };
}

export interface ApiResponse {
  message: string;
  status: boolean;
}

export interface DailyDiscountState {
  discounts: DailyDiscount[];
  loading: boolean;
  error: string | null;
  discountCreated: boolean;
  discountUpdated: boolean;
}
