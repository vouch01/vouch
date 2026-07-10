"use client";

import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/checkout.service";

export const getCheckoutOrderQueryKey = (token: string) => [
  "checkout-order",
  token,
];

export function useCheckoutOrder(
  checkoutToken?: string
) {
  return useQuery({
    queryKey: getCheckoutOrderQueryKey(checkoutToken ?? ""),
    enabled: !!checkoutToken,
    queryFn: () =>
      orderService.getCheckoutOrder(checkoutToken!),
  });
}