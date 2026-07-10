/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { riderService } from "@/services/rider.service";
import { useToast } from "@/components/ui/use-toast";

import type { VerifyPinDto, VerifyPinResponse } from "@/types/rider";

export const getGetRiderOrderQueryKey = (reference: string) =>
  ["rider-order", reference] as const;

export function useGetRiderOrder(reference: string) {
  return useQuery({
    queryKey: getGetRiderOrderQueryKey(reference),
    queryFn: () => riderService.getOrder(reference),
    enabled: !!reference,
  });
}

export function useVerifyPin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    VerifyPinResponse,
    Error,
    VerifyPinDto
  >({
    mutationFn: riderService.verifyPin,

    onSuccess: (_, variables) => {
      toast({
        title: "Pin Verification",
        description: "PIN verified successfully",
      });

      queryClient.invalidateQueries({
        queryKey: getGetRiderOrderQueryKey(
          variables.reference
        ),
      });
    },

    onError: (error: any) => {
      toast({
        title: "Failed Pin Verification",
        description:
          error?.response?.data?.message ??
          "Unable to verify PIN",
        variant: "destructive",
      });
    },
  });
}
