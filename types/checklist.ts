export interface Checklist {
  id: number
  name: string
  items: ChecklistItem[] | null
  checklistCompletionStatus: boolean
  createdAt?: string
}

export interface ApiResponse<T> {
  statusCode: number
  message: string
  errorMessage?: string | null
  data: T
}

export interface CreateChecklistRequest {
  name: string
}

export interface ChecklistItem {
  id: number
  name: string
  itemCompletionStatus: boolean
}


export interface CreateChecklistItemRequest {
  itemName: string
}

export interface RenameChecklistItemRequest {
  itemName: string
}
export interface ChecklistResponse {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}