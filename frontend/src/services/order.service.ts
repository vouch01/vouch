import api from "@/lib/axios";
import {
  CreateOrderDto,
  CreateOrderResponse,
} from "@/types/order";

export const orderService = {
  createOrder: async (
    payload: CreateOrderDto
  ) => {
    const { data } =
      await api.post<CreateOrderResponse>(
        "/order/create",
        payload
      );

    return data;
  },
};