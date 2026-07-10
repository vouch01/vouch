/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orders.service";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useToast } from "@/components/ui/use-toast";

export function useOrders() {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS,
    queryFn: orderService.getOrders,
  });
};

export function useOrder(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SINGLE_ORDER(id),
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
  });
};

export function useCancelOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: orderService.cancelOrder,

    onSuccess: () => {
      toast({
        title: "Order cancelled",
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ORDERS,
      });
    },

    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Unable to cancel order",
        description:
          error?.response?.data?.message,
      });
    },
  });
};

export function useOrderStatus(
  checkoutToken: string
) {
  return useQuery({
    queryKey: QUERY_KEYS.ORDER_PIN(checkoutToken),
    queryFn: () =>
      orderService.getOrderStatus(checkoutToken),
    enabled: !!checkoutToken,
    refetchInterval: 5000,
  });
}