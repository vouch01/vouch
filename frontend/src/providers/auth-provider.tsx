

"use client";

import { useMe } from "@/hooks/use-me";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  type ReactNode
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
  login: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const router = useRouter();
  const queryClient = useQueryClient();

  const {
  isPending,
  isSuccess,
  isError,
} = useMe();

const token =
  typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null;

const hasToken = !!token;

const loading = hasToken && isPending;

const isAuthenticated = hasToken && isSuccess;


  const login = async (token: string) => {
  localStorage.setItem("accessToken", token);

  await queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.USER,
  });
};

  const logout = () => {
    localStorage.removeItem("accessToken");

    queryClient.removeQueries({
        queryKey: QUERY_KEYS.USER,
    });

    router.replace("/login");
};

  return (
    <AuthContext.Provider
      value={{
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider"
    );
  }

  return context;
}