import { apiRequest } from './client'
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth'

export async function loginUser(credentials: LoginRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export async function registerUser(credentials: RegisterRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}