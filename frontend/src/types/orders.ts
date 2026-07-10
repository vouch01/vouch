export interface Order {
  id: string;
  vendor_id: string;
  buyer_phone: string | null;
  buyer_email: string | null;
  item_name: string;
  item_description: string;
  additional_notes: string | null;
  delivery_address: string | null;
  expected_amount: number;
  amount_paid: number;
  status:
    | "PENDING_PAYMENT"
    | "PAID_IN_ESCROW"
    | "DISPATCHED"
    | "SETTLED"
    | "EXPIRED"
    | "REFUNDED";
  checkout_token: string;
  virtual_account_number: string | null;
  rider_token: string | null;
  expires_at: string;
  created_at: string;
}

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}