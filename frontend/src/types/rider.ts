export interface RiderOrder {
  success: boolean;
  message: string;
  data: {
    id: string;
    buyer_name: string;
    buyer_phone: string;
    item_description: string;
    delivery_address: string;
    amount: number;
    status: string;
    verification_pin?: string;
  };
}

export interface VerifyPinDto {
  reference: string;
  pin: string;
}

export interface VerifyPinResponse {
  success: boolean;
  message: string;
}