"use client";

import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { QUERY_KEYS } from "@/lib/query-keys";

export function useOrder(
  referenceId: string,
  options?: {
    poll?: boolean;
  }
) {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDER, referenceId],
    queryFn: () => orderService.getOrder(referenceId),
    enabled: !!referenceId,
    refetchInterval:
      options?.poll
        ? (query) => {
            const status = query.state.data?.data?.status;
            return status === "PENDING" ? 5000 : false;
          }
        : false,
  });
}