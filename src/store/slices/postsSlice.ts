import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PostsState, Post } from '../../types'

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  totalCount: 0,
  loading: false,
  error: null,
  filters: {
    search: '',
    page: 1,
    limit: 10,
  },
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    fetchPostsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchAdminPostsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchPostsSuccess: (state, action: PayloadAction<{ posts: Post[]; totalCount: number }>) => {
      state.loading = false
      state.posts = action.payload.posts
      state.totalCount = action.payload.totalCount
      state.error = null
    },
    fetchPostsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    fetchPostStart: (state, action: PayloadAction<string>) => {
      state.loading = true
      state.error = null
    },
    fetchPostSuccess: (state, action: PayloadAction<Post>) => {
      state.loading = false
      state.currentPost = action.payload
      state.error = null
    },
    fetchPostFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    createPostStart: (state, action: PayloadAction<Omit<Post, 'id' | 'created_at' | 'updated_at'>>) => {
      state.loading = true
      state.error = null
    },
    createPostSuccess: (state, action: PayloadAction<Post>) => {
      state.loading = false
      state.posts.unshift(action.payload)
      state.error = null
    },
    createPostFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    updatePostStart: (state, action: PayloadAction<{ id: string | number; post: Partial<Post> }>) => {
      state.loading = true
      state.error = null
    },
    updatePostSuccess: (state, action: PayloadAction<Post>) => {
      state.loading = false
      const index = state.posts.findIndex(post => post.id === action.payload.id)
      if (index !== -1) {
        state.posts[index] = action.payload
      }
      if (state.currentPost?.id === action.payload.id) {
        state.currentPost = action.payload
      }
      state.error = null
    },
    updatePostFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    deletePostStart: (state, action: PayloadAction<number>) => {
      state.loading = true
      state.error = null
    },
    deletePostSuccess: (state, action: PayloadAction<number>) => {
      state.loading = false
      state.posts = state.posts.filter(post => post.id !== action.payload)
      if (state.currentPost?.id === action.payload) {
        state.currentPost = null
      }
      state.error = null
    },
    deletePostFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<PostsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearCurrentPost: (state) => {
      state.currentPost = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  fetchPostsStart,
  fetchAdminPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  fetchPostStart,
  fetchPostSuccess,
  fetchPostFailure,
  createPostStart,
  createPostSuccess,
  createPostFailure,
  updatePostStart,
  updatePostSuccess,
  updatePostFailure,
  deletePostStart,
  deletePostSuccess,
  deletePostFailure,
  setFilters,
  clearCurrentPost,
  clearError,
} = postsSlice.actions

export default postsSlice.reducer
