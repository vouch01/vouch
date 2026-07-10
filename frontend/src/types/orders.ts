export type OrderStatus = "PENDING" | "PAID_IN_ESCROW" | "DISPATCHED" | "SETTLED" | "DISPUTED";

export interface Order {
  id: string;
  item: string;
  description: string;
  amount: number;
  buyer: string;
  status: OrderStatus;
  timeAgo: string;
  dateCreated: string;
  deliveryAddress: string;
  notes?: string;
}