/* eslint-disable react-hooks/set-state-in-effect  */
"use client";

import { useMe } from "@/hooks/use-me";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
  login: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(null);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
    setHasCheckedStorage(true);
  }, []);

  const hasToken = !!token;

  const { isPending, isSuccess } = useMe();

  const loading = !hasCheckedStorage || (hasToken && isPending);

  const isAuthenticated = hasToken && isSuccess;

  //   const login = async (token: string) => {
  //   localStorage.setItem("accessToken", token);

  //   await queryClient.invalidateQueries({
  //     queryKey: QUERY_KEYS.USER,
  //   });
  // };

  const login = async (newToken: string) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken); // <-- this is the missing piece: tell React something changed
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER });
  };

  //   const logout = () => {
  //     localStorage.removeItem("accessToken");

  //     queryClient.removeQueries({
  //         queryKey: QUERY_KEYS.USER,
  //     });

  //     router.replace("/login");
  // };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    queryClient.removeQueries({ queryKey: QUERY_KEYS.USER });
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
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
}
