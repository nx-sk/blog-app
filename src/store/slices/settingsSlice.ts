import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SiteSettings {
  id?: number
  header_brand?: string
  header_subtitle?: string
  sidebar_title?: string
  sidebar_description?: string
  social_links?: any
  avatar_url?: string
  updated_at?: string
  updated_by?: string
}

interface SettingsState {
  data: SiteSettings | null
  loading: boolean
  error: string | null
}

const initialState: SettingsState = {
  data: null,
  loading: false,
  error: null,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    fetchSettingsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchSettingsSuccess: (state, action: PayloadAction<SiteSettings>) => {
      state.loading = false
      state.data = action.payload
      state.error = null
    },
    fetchSettingsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    updateSettingsStart: (state, _action: PayloadAction<Partial<SiteSettings>>) => {
      state.loading = true
      state.error = null
    },
    updateSettingsSuccess: (state, action: PayloadAction<SiteSettings>) => {
      state.loading = false
      state.data = action.payload
      state.error = null
    },
    updateSettingsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    // Optimistic local update
    setLocalSettings: (state, action: PayloadAction<Partial<SiteSettings>>) => {
      state.data = { ...(state.data || {}), ...action.payload }
    },
  },
})

export const {
  fetchSettingsStart,
  fetchSettingsSuccess,
  fetchSettingsFailure,
  updateSettingsStart,
  updateSettingsSuccess,
  updateSettingsFailure,
  setLocalSettings,
} = settingsSlice.actions

export default settingsSlice.reducer

