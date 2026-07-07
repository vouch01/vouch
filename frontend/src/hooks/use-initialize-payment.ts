import { orderService } from "@/services/order.service";
import { useMutation } from "@tanstack/react-query";

export function useInitializePayment() {
  return useMutation({
    mutationFn: orderService.initializePayment,
  });
}