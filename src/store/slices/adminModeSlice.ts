import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface EditingPost {
  id?: string | number
  title: string
  content: string
  slug: string
  excerpt?: string
  featured_image?: string
  tags: string[]
  isDraft: boolean
  hasUnsavedChanges: boolean
  created_at?: string
  updated_at?: string
  author_id?: string
  status?: 'draft' | 'published'
}

export interface AdminModeState {
  isAdmin: boolean
  isAdminMode: boolean
  isEditingMode: boolean
  currentEditingPost: EditingPost | null
  autoSaveEnabled: boolean
  lastAutoSave: string | null
}

const initialState: AdminModeState = {
  isAdmin: false,
  isAdminMode: false,
  isEditingMode: false,
  currentEditingPost: null,
  autoSaveEnabled: true,
  lastAutoSave: null,
}

const adminModeSlice = createSlice({
  name: 'adminMode',
  initialState,
  reducers: {
    setIsAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload
      if (!action.payload) {
        state.isAdminMode = false
        state.isEditingMode = false
        state.currentEditingPost = null
      }
    },
    toggleAdminMode: (state) => {
      if (state.isAdmin) {
        state.isAdminMode = !state.isAdminMode
        if (!state.isAdminMode) {
          state.isEditingMode = false
          state.currentEditingPost = null
        }
      }
    },
    setAdminMode: (state, action: PayloadAction<boolean>) => {
      if (state.isAdmin) {
        state.isAdminMode = action.payload
        if (!action.payload) {
          state.isEditingMode = false
          state.currentEditingPost = null
        }
      }
    },
    toggleEditingMode: (state) => {
      if (state.isAdmin && state.isAdminMode) {
        state.isEditingMode = !state.isEditingMode
      }
    },
    setEditingMode: (state, action: PayloadAction<boolean>) => {
      if (state.isAdmin && state.isAdminMode) {
        state.isEditingMode = action.payload
      }
    },
    setCurrentEditingPost: (state, action: PayloadAction<EditingPost | null>) => {
      state.currentEditingPost = action.payload
    },
    updateCurrentEditingPost: (state, action: PayloadAction<Partial<EditingPost>>) => {
      if (state.currentEditingPost) {
        state.currentEditingPost = {
          ...state.currentEditingPost,
          ...action.payload,
          hasUnsavedChanges: true,
        }
      }
    },
    markPostAsSaved: (state) => {
      if (state.currentEditingPost) {
        state.currentEditingPost.hasUnsavedChanges = false
        state.lastAutoSave = new Date().toISOString()
      }
    },
    toggleAutoSave: (state) => {
      state.autoSaveEnabled = !state.autoSaveEnabled
    },
    resetEditingState: (state) => {
      state.isEditingMode = false
      state.currentEditingPost = null
    },
  },
})

export const {
  setIsAdmin,
  toggleAdminMode,
  setAdminMode,
  toggleEditingMode,
  setEditingMode,
  setCurrentEditingPost,
  updateCurrentEditingPost,
  markPostAsSaved,
  toggleAutoSave,
  resetEditingState,
} = adminModeSlice.actions

export default adminModeSlice.reducer