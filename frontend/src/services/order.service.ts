import api from "@/lib/axios";
import { OrderResponse } from "@/types/order";




export const orderService = {

initializePayment: async (referenceId: string) => {
    return api.post(`/orders/${referenceId}/pay`);
},

  getOrder: async (referenceId: string) => {
    const { data } = await api.get<OrderResponse>(
      `/orders/${referenceId}`
    );

    return data;
  },
};