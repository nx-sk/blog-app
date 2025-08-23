export interface Post {
  id: number
  title: string
  slug?: string
  content: string
  excerpt?: string
  featured_image?: string
  status: 'draft' | 'published'
  published_at?: string
  created_at: string
  updated_at: string
  author_id: string
  category_id?: number
  categories?: Category[]
  tags?: Tag[]
}

export interface Category {
  id: number
  name: string
  slug?: string
  description?: string
  created_at: string
}

export interface Tag {
  id: number
  name: string
  slug?: string
  created_at: string
}

export interface User {
  id: string
  email?: string
  user_metadata: {
    name?: string
    avatar_url?: string
  }
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface PostsState {
  posts: Post[]
  currentPost: Post | null
  totalCount: number
  loading: boolean
  error: string | null
  filters: {
    category?: number
    tag?: number
    search: string
    page: number
    limit: number
  }
}

export interface UIState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  editorMode: 'edit' | 'preview' | 'split'
  previewLayout?: 'horizontal' | 'vertical'
  previewSide?: 'left' | 'right'
}
