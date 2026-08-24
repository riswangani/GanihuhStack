import apiFetch from '@/shared/api/api-client'
import type { AckDto } from '@/features/blog/api/blogPosts'

export interface SkillDto {
  id: number
  name: string
}

export interface CreateSkillRequest {
  name: string
}

export const getSkills = () => apiFetch<SkillDto[]>('/api/skills')
export const createSkill = (data: CreateSkillRequest) =>
  apiFetch<AckDto>('/api/skills', { method: 'POST', body: JSON.stringify(data) })
export const deleteSkill = (id: number) =>
  apiFetch<AckDto>(`/api/skills/${id}`, { method: 'DELETE' })
