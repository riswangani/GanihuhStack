import apiFetch from './api'
import type { AckDto } from './blogPosts'

export interface ProjectDto {
  id: number
  name: string
  description: string | null
  technologies: string | null
  repositoryUrl: string | null
  demoUrl: string | null
  isFeatured: boolean
  created: string
  lastModified: string
}

export interface CreateProjectRequest {
  name: string
  description?: string
  technologies?: string
  repositoryUrl?: string
  demoUrl?: string
  isFeatured: boolean
}

export interface UpdateProjectRequest extends CreateProjectRequest {
  id: number
}

export const getProjects = () => apiFetch<ProjectDto[]>('/api/projects')
export const createProject = (data: CreateProjectRequest) =>
  apiFetch<AckDto>('/api/projects', { method: 'POST', body: JSON.stringify(data) })
export const updateProject = (id: number, data: CreateProjectRequest) =>
  apiFetch<AckDto>(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteProject = (id: number) =>
  apiFetch<AckDto>(`/api/projects/${id}`, { method: 'DELETE' })
