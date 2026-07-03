import api from "@/lib/axios"
import {
  LoginDto,
  SignupDto,
  VerifyOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponse,
} from "@/types/auth"

export const authService = {
  login: async (payload: LoginDto) => {
    const { data } = await api.post<AuthResponse>("/login", payload)
    return data
  },

  signup: async (payload: SignupDto) => {
    const { data } = await api.post("/signup", payload)
    return data
  },

  verifyOtp: async (payload: VerifyOtpDto) => {
    const { data } = await api.post("/verify-otp", payload)
    return data
  },

  forgotPassword: async (payload: ForgotPasswordDto) => {
    const { data } = await api.post("/forget-password", payload)
    return data
  },

  resetPassword: async (payload: ResetPasswordDto) => {
    const { data } = await api.post("/reset", payload)
    return data
  },
}