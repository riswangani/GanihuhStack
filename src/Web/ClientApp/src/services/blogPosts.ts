import apiFetch from './api'

export interface BlogPostDto {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  tags: string | null
  isPublished: boolean
  publishedDate: string | null
  created: string
  lastModified: string
}

export const getBlogPosts = () => apiFetch<BlogPostDto[]>('/api/blogposts')
