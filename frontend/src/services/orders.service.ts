import api from "@/lib/axios";
import { ApiResponse, Order } from "@/types/orders";

export const orderService = {

  getOrders: async () => {
    const { data } = await api.get<ApiResponse<Order[]>>(
      "/order/all"
    );

    return data;
  },

  getOrder: async (id: string) => {
    const { data } =
      await api.get<ApiResponse<Order>>(`/order/${id}`);

    return data;
  },

  cancelOrder: async (id: string) => {
    const { data } =
      await api.delete<ApiResponse<null>>(
        `/order/cancel/${id}`
      );

    return data;
  },

  getOrderStatus: async (
    checkoutToken: string
  ) => {
    const { data } =
      await api.get(`/order/status/${checkoutToken}`);

    return data;
  },
};