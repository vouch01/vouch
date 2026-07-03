export interface LoginDto {
  email: string
  password: string
}

export interface SignupDto {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface VerifyOtpDto {
  email: string
  otp: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  token: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
    refreshToken: string
    user: {
      id: string
      firstName: string
      lastName: string
      email: string
    }
  }
}