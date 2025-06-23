export interface Checklist {
  id: number
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateChecklistRequest {
  name: string
}

export interface ChecklistItem {
  id: number
  name: string
  completed: boolean
  checklistId: number
  createdAt?: string
  updatedAt?: string
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