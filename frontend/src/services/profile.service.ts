import api from "@/lib/axios";
import type { Vendor } from "@/types/vendor";

export const profileService = {
  me: async () => {
    const { data } = await api.get<{
      success: boolean;
      data: Vendor;
      message: string;
    }>("/profile/retrieve");

    return data;
  },

  update: async (payload: Partial<Vendor>) => {
    const { data } = await api.put("/profile/update", payload);

    return data;
  },

  delete: async () => {
    const { data } = await api.delete("/profile/delete");

    return data;
  },
};