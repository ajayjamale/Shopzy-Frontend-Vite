import type { Product } from './productTypes';
import type { Address, User } from './userTypes';

export interface OrderState {
    orders: Order[];
    orderItem:OrderItem | null;
    currentOrder: Order | null;
    paymentOrder: any | null;
    loading: boolean;
    error: string | null;
    orderCanceled: boolean;
    paymentConfirmed: boolean;
}

export interface Order {
    id: number;
    orderId: string;
    user: User;
    sellerId: number;
    orderItems: OrderItem[];
    orderDate: string; 
    shippingAddress: Address;
    paymentDetails: any;
    createdAt?: string;
    totalMrpPrice: number;
    totalSellingPrice?: number; // Optional field
    discount?: number; // Optional field
    orderStatus: OrderStatus;
    totalItem: number;
    deliverDate:string;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PLACED = 'PLACED',
    CONFIRMED = 'CONFIRMED',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    REFUND_INITIATED = 'REFUND_INITIATED',
    RETURNED = 'RETURNED',
    RETURN_REQUESTED = 'RETURN_REQUESTED'
}

export type ReturnStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'PICKUP_SCHEDULED'
  | 'RECEIVED'
  | 'REFUND_INITIATED'
  | 'REFUNDED';

export interface ReturnRequest {
    id?: number;
    orderId: number;
    orderItemId: number;
    userId?: number;
    sellerId?: number;
    quantity: number;
    reason: string;
    description?: string;
    images?: string[];
    status?: ReturnStatus;
    adminComment?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface OrderItem {
    id: number;
    order: Order;
    product: Product;
    size: string;
    quantity: number;
    mrpPrice: number;
    sellingPrice: number; 
    userId: number;
}
