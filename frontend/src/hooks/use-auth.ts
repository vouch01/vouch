/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useToast } from "../components/ui/use-toast";

import type {
  LoginDto,
  SignupDto,
  VerifyOtpDto,
  GenerateOtpDto,
  ResetPasswordDto,
} from "@/types/auth";

export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: LoginDto) => authService.login(payload),

    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.token);

      queryClient.setQueryData(QUERY_KEYS.USER, data.data);

      toast({
        title: "Login Successful",
        description: data.message || "You have been logged in successfully.",
      });
    },

    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description:
          error?.response?.data?.message ||
          "Unable to login. Please try again.",
      });
    },
  });
}

export function useSignup() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: SignupDto) => authService.signup(payload),

    onSuccess: (data) => {
      toast({
        title: "Signup Successful",
        description: data.message || "You have been signed up successfully.",
      });
    },

    onError: (error: any) => {
      toast({
        title: "Signup Failed",
        description:
          error?.response?.data?.message ||
          "Unable to signup. Please try again.",
      });
    },
  });
}

export function useVerifyOtp() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: VerifyOtpDto) => authService.verifyOtp(payload),
    onSuccess: (data) => {
      toast({
        title: "OTP Verified",
        description: data.message || "OTP has been verified successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "OTP Verification Failed",
        description:
          error?.response?.data?.message ||
          "Unable to verify OTP. Please try again.",
      });
    },
  });
}

export function useGenerateOtp() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: GenerateOtpDto) => authService.generateOtp(payload),
    onSuccess: (data) => {
      toast({
        title: "OTP Generated",
        description: data.message || "OTP has been generated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "OTP Generation Failed",
        description:
          error?.response?.data?.message ||
          "Unable to generate OTP. Please try again.",
      });
    },
  });
}

export function useResetPassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: ResetPasswordDto) =>
      authService.resetPassword(payload),
    onSuccess: (data) => {
      toast({
        title: "Password Reset Successful",
        description:
          data.message || "Your password has been reset successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Password Reset Failed",
        description:
          error?.response?.data?.message ||
          "Unable to reset password. Please try again.",
      });
    },
  });
}
