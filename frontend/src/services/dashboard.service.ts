import api from "@/lib/axios"

export const dashboardService = {
  async getSummary() {
    const { data } = await api.get("/vendor/dashboard")
    return data
  },
}