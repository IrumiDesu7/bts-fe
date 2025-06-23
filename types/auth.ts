export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  email: string
}

export interface AuthResponse {
  token?: string
  message?: string
  user?: User
}

export interface User {
  id: string
  username: string
  email: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (credentials: LoginRequest) => Promise<void>
  register: (credentials: RegisterRequest) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}