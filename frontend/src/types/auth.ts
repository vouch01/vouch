import { Vendor } from "./vendor"

export interface LoginDto {
  email: string
  password: string
}

export interface SignupDto {
  business_name: string
  email: string
  password: string
}

export interface VerifyOtpDto {
  email: string
  otp: string
}

export interface GenerateOtpDto {
  email: string
}

export interface ResetPasswordDto {
  token: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
    status: number
    success: boolean
    message: string
    token: string
    data: Vendor
}