"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { authService } from "@/services/auth.service"
import { QUERY_KEYS } from "@/lib/query-keys"

import type {
  LoginDto,
  SignupDto,
  VerifyOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "@/types/auth"

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginDto) =>
      authService.login(payload),

    onSuccess: (data) => {
      localStorage.setItem(
        "accessToken",
        data.data.accessToken
      )

      localStorage.setItem(
        "refreshToken",
        data.data.refreshToken
      )

      queryClient.setQueryData(
        QUERY_KEYS.USER,
        data.data.user
      )
    },
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupDto) =>
      authService.signup(payload),
  })
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (payload: VerifyOtpDto) =>
      authService.verifyOtp(payload),
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordDto) =>
      authService.forgotPassword(payload),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordDto) =>
      authService.resetPassword(payload),
  })
}