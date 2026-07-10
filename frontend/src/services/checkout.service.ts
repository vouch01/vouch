import api from "@/lib/axios";
import { CheckoutOrderResponse } from "@/types/checkout";

export const orderService = {
  getCheckoutOrder: async (checkoutToken: string) => {
    const { data } = await api.get<CheckoutOrderResponse>(
      `/pay/${checkoutToken}`
    );

    return data;
  },
};