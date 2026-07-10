/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

import { orderService } from "@/services/order.service";
import { QUERY_KEYS } from "@/lib/query-keys";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: orderService.createOrder,

    onSuccess: (data) => {
      toast({
        title: "Order Created",
        description: data.message || "Order has been successfully created"
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ORDERS,
      });
    },

    onError: (error: any) => {
      toast({
        title: "Order creation failed",
        description: error.response?.data.message ?? "Unable to create order.",
        variant: "destructive",
      });
    },
  });
}