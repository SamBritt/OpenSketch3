import { create } from 'zustand'
import api from '@/lib/api'
import { User, AuthResponse } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (userName: string, password: string) => Promise<void>
  register: (userName: string, firstName: string, lastName: string, password: string) => Promise<void>
  logout: () => void
  restoreSession: () => Promise<void>
  updateProfile: (updates: { avatarUrl?: string; userName?: string; currentPassword?: string; newPassword?: string }) => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  login: async (userName, password) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { userName, password })
    localStorage.setItem('os_token', data.token)
    set({ user: data.user, token: data.token })
  },

  register: async (userName, firstName, lastName, password) => {
    const { data } = await api.post<AuthResponse>('/auth/register', { userName, firstName, lastName, password })
    localStorage.setItem('os_token', data.token)
    set({ user: data.user, token: data.token })
  },

  logout: () => {
    localStorage.removeItem('os_token')
    set({ user: null, token: null })
  },

  restoreSession: async () => {
    set({ isLoading: true })
    const token = localStorage.getItem('os_token')
    if (!token) {
      set({ isLoading: false })
      return
    }
    try {
      const { data } = await api.get<User>('/auth/me')
      set({ user: data, token, isLoading: false })
    } catch {
      localStorage.removeItem('os_token')
      set({ user: null, token: null, isLoading: false })
    }
  },

  updateProfile: async (updates) => {
    const { data } = await api.patch<{ user: User; token: string }>('/users/me', updates)
    localStorage.setItem('os_token', data.token)
    set({ user: data.user, token: data.token })
  },
}))
