const API_BASE_URL = 'http://94.74.86.174:8080/api'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      let errorData = null
      
      try {
        errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        // If response is not JSON, use default message
      }
      
      throw new ApiError(errorMessage, response.status, errorData)
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }
    
    return {} as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    // Network or other errors
    throw new ApiError(
      'Network error occurred. Please check your connection.',
      0,
      error
    )
  }
}

export function createAuthHeaders(token: string): HeadersInit {
  return {
    'Authorization': `Bearer ${token}`,
  }
}