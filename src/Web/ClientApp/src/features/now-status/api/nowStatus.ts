import apiFetch from '@/shared/api/api-client'
import type { AckDto } from '@/features/blog/api/blogPosts'

export interface NowStatusDto {
  id: number
  currentFocus: string
  details: string | null
  currentlyReading: string | null
  mood: string | null
  created: string
  lastModified: string
}

export interface UpdateNowStatusRequest {
  currentFocus: string
  details?: string
  currentlyReading?: string
  mood?: string
}

export const getCurrentNowStatus = () => apiFetch<NowStatusDto | null>('/api/now-status')
export const getNowStatusHistory = () => apiFetch<NowStatusDto[]>('/api/now-status/history')
export const updateNowStatus = (data: UpdateNowStatusRequest) =>
  apiFetch<AckDto>('/api/now-status', { method: 'POST', body: JSON.stringify(data) })
