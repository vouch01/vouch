import api from "@/lib/axios"
import {
  LoginDto,
  SignupDto,
  VerifyOtpDto,
  GenerateOtpDto,
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
    const { data } = await api.post("/verify", payload)
    return data
  },

  generateOtp: async (payload: GenerateOtpDto) => {
    const { data } = await api.post("/otp", payload)
    return data
  },

  resetPassword: async (payload: ResetPasswordDto) => {
    const { data } = await api.post("/reset", payload)
    return data
  },
}