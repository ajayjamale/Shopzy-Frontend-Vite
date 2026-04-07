// Settlement domain types for seller payouts and admin monitoring

export type SettlementStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'ELIGIBLE'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface Settlement {
  id: number;
  sellerId: number;
  orderId: number;
  transactionId?: string;
  orderReference?: string;
  grossAmount: number;
  commissionAmount: number;
  platformFee: number;
  taxAmount?: number;
  netSettlementAmount: number;
  settlementStatus: SettlementStatus;
  paymentMethod: string;
  settlementDate?: string;
  createdAt?: string;
  updatedAt?: string;
  remarks?: string;
}

export interface SettlementPayload {
  sellerId: number;
  orderId: number;
  transactionId?: string;
  grossAmount: number;
  commissionAmount: number;
  platformFee: number;
  taxAmount?: number;
  netSettlementAmount: number;
  paymentMethod: string;
  settlementDate?: string;
  remarks?: string;
}

export interface SettlementSummary {
  totalGrossAmount: number;
  totalCommission: number;
  totalPlatformFee: number;
  totalTax: number;
  totalNetAmount: number;
  pendingCount: number;
  processingCount: number;
  eligibleCount?: number;
  onHoldCount?: number;
  completedCount: number;
  failedCount: number;
  cancelledCount: number;
}

export interface SettlementQuery {
  status?: SettlementStatus;
  sellerId?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  sort?: string;
}
