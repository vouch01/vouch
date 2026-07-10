// types/checkout.ts

export interface CheckoutOrderResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    paymentDetails: {
      bankAccountName: string;
      bankAccountNumber: string;
      expiryDate: string;
    };
    orderDetails: {
      buyer_phone: string;
      item_name: string;
      item_description: string;
      businessName: string;
      formattedAmount: string;
    };
  };
}