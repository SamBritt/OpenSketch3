import { create } from 'zustand'
import api from '../lib/api'
import { Image } from '../types'

interface ImageStore {
  images: Image[]
  currentImage: Image | null
  currentImageLoading: boolean
  userImages: Image[]
  fetchImages: () => Promise<void>
  fetchImage: (id: number) => Promise<void>
  fetchUserImages: (userName: string) => Promise<void>
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  currentImage: null,
  currentImageLoading: false,
  userImages: [],

  fetchImages: async () => {
    try {
      const { data } = await api.get<Image[]>('/images')
      set({ images: data })
    } catch {
      set({ images: [] })
    }
  },

  fetchImage: async (id) => {
    set({ currentImageLoading: true, currentImage: null })
    try {
      const { data } = await api.get<Image>(`/images/${id}`)
      set({ currentImage: data, currentImageLoading: false })
    } catch {
      set({ currentImage: null, currentImageLoading: false })
    }
  },

  fetchUserImages: async (userName) => {
    try {
      const { data } = await api.get<Image[]>(`/images/username/${userName}`)
      set({ userImages: data })
    } catch {
      set({ userImages: [] })
    }
  },
}))
