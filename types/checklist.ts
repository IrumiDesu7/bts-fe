export interface Checklist {
  id: number
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateChecklistRequest {
  name: string
}

export interface ChecklistResponse {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}