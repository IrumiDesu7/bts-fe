import { apiRequest, createAuthHeaders } from './client'
import type { Checklist, CreateChecklistRequest, ApiResponse } from '@/types/checklist'

export async function getAllChecklists(token: string): Promise<Checklist[]> {
  const response = await apiRequest<ApiResponse<Checklist[]>>('/checklist', {
    method: 'GET',
    headers: createAuthHeaders(token),
  })
  return response.data
}


export async function createChecklist(
  data: CreateChecklistRequest,
  token: string
): Promise<Checklist> {
  const response = await apiRequest<ApiResponse<Checklist>>('/checklist', {
    method: 'POST',
    headers: createAuthHeaders(token),
    body: JSON.stringify(data),
  })
  return response.data
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