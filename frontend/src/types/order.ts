export type OrderStatus = "PENDING_PAYMENT" | "PAID_IN_ESCROW" | "DISPATCHED" | "SETTLED" | "DISPUTED";

export interface CreateOrderDto {
  buyer_phone: string;
  item_name: string;
  item_description: string;
  amount: number;
  additional_notes: string;
  delivery_address?: string;
}

export interface Order {
  id: string;
  vendor_id: string;
  buyer_phone: string;
  item_description: string;
  additional_notes: string;
  delivery_address: string;
  checkout_token: string;
  expected_amount: number;
  status: OrderStatus;
  expires_at: string;
  created_at: string;
}

export type CreatedOrder = Order & {
  escrowLink: string;
};

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  escrowLink: string;
  data: Order;
}