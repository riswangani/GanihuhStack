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

export interface AckDto {
  message: string
  id: number
}

export interface CreateBlogPostRequest {
  title: string
  content: string
  excerpt?: string
  tags?: string
}

export interface UpdateBlogPostRequest {
  title: string
  content: string
  excerpt?: string
  tags?: string
  slug?: string
  isPublished: boolean
}

export const getBlogPosts       = () => apiFetch<BlogPostDto[]>('/api/blog-posts')
export const getBlogPostBySlug  = (slug: string) => apiFetch<BlogPostDto>(`/api/blog-posts/${slug}`)
export const createBlogPost  = (data: CreateBlogPostRequest) => apiFetch<AckDto>('/api/blog-posts', { method: 'POST', body: JSON.stringify(data) })
export const updateBlogPost  = (id: number, data: UpdateBlogPostRequest) => apiFetch<AckDto>(`/api/blog-posts/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteBlogPost  = (id: number) => apiFetch<AckDto>(`/api/blog-posts/${id}`, { method: 'DELETE' })
