import { QUERY_KEYS } from "@/lib/query-keys";
import { profileService } from "@/services/profile.service";
import { useQuery } from "@tanstack/react-query";

export function useMe() {
  return useQuery({
    queryKey: QUERY_KEYS.USER,
    queryFn: profileService.me,
    retry: false,
    enabled:
      typeof window !== "undefined" &&
      !!localStorage.getItem("accessToken"),
  });
}