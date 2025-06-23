import { ChecklistItem } from '@/types/checklist'
import { apiRequest, createAuthHeaders } from './client'

export async function getChecklistItems(checklistId: number, token: string): Promise<ChecklistItem[]> {
  return apiRequest<ChecklistItem[]>(`/checklist/${checklistId}/item`, {
    method: 'GET',
    headers: createAuthHeaders(token),
  })
}

export async function createChecklistItem(
  checklistId: number, 
  itemName: string, 
  token: string
): Promise<ChecklistItem> {
  return apiRequest<ChecklistItem>(`/checklist/${checklistId}/item`, {
    method: 'POST',
    headers: createAuthHeaders(token),
    body: JSON.stringify({ itemName }),
  })
}

export async function getChecklistItem(
  checklistId: number, 
  checklistItemId: number, 
  token: string
): Promise<ChecklistItem> {
  return apiRequest<ChecklistItem>(`/checklist/${checklistId}/item/${checklistItemId}`, {
    method: 'GET',
    headers: createAuthHeaders(token),
  })
}

export async function updateChecklistItemStatus(
  checklistId: number, 
  checklistItemId: number, 
  token: string
): Promise<ChecklistItem> {
  return apiRequest<ChecklistItem>(`/checklist/${checklistId}/item/${checklistItemId}`, {
    method: 'PUT',
    headers: createAuthHeaders(token),
  })
}

export async function deleteChecklistItem(
  checklistId: number, 
  checklistItemId: number, 
  token: string
): Promise<void> {
  return apiRequest<void>(`/checklist/${checklistId}/item/${checklistItemId}`, {
    method: 'DELETE',
    headers: createAuthHeaders(token),
  })
}

export async function renameChecklistItem(
  checklistId: number, 
  checklistItemId: number, 
  itemName: string, 
  token: string
): Promise<ChecklistItem> {
  return apiRequest<ChecklistItem>(`/checklist/${checklistId}/item/rename/${checklistItemId}`, {
    method: 'PUT',
    headers: createAuthHeaders(token),
    body: JSON.stringify({ itemName }),
  })
}