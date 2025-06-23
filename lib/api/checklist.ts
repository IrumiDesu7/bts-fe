import { apiRequest, createAuthHeaders } from './client'
import type { Checklist, CreateChecklistRequest, ChecklistResponse } from '@/types/checklist'

export async function getAllChecklists(token: string): Promise<Checklist[]> {
  return apiRequest<Checklist[]>('/checklist', {
    method: 'GET',
    headers: createAuthHeaders(token),
  })
}

export async function createChecklist(
  data: CreateChecklistRequest,
  token: string
): Promise<ChecklistResponse> {
  return apiRequest<ChecklistResponse>('/checklist', {
    method: 'POST',
    headers: createAuthHeaders(token),
    body: JSON.stringify(data),
  })
}

export async function deleteChecklist(
  checklistId: number,
  token: string
): Promise<void> {
  return apiRequest<void>(`/checklist/${checklistId}`, {
    method: 'DELETE',
    headers: createAuthHeaders(token),
  })
}