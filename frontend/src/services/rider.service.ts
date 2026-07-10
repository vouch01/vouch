import api from "@/lib/axios";
import {
  RiderOrder,
  VerifyPinDto,
  VerifyPinResponse,
} from "@/types/rider";

export const riderService = {
  getOrder: async (reference: string) => {
    const { data } = await api.get<RiderOrder>(
      `/rider/order/${reference}`
    );

    return data;
  },

  verifyPin: async (payload: VerifyPinDto) => {
  const { data } = await api.post<VerifyPinResponse>(
    `/rider/${payload.reference}/verify`,
    {
      pin: payload.pin,
    }
  );

  return data;
}
};