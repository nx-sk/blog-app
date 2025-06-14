import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UIState } from '../../types'

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: false,
  editorMode: 'split',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setEditorMode: (state, action: PayloadAction<'edit' | 'preview' | 'split'>) => {
      state.editorMode = action.payload
    },
  },
})

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setEditorMode,
} = uiSlice.actions

export default uiSlice.reducer