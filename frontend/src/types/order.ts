export type OrderStatus = "PENDING" | "PAID_IN_ESCROW" | "DISPATCHED" | "SETTLED" | "DISPUTED";

export interface Order {
  id: string;
  itemDescription: string;
  reference: string;
  businessName: string;
  amount: number;
  buyerPhone: string;
  status: OrderStatus;
  timeAgo: string;
  dateCreated: string;
  deliveryAddress: string;
  notes?: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}