import { create } from 'zustand'
import api from '../lib/api'
import { Image } from '../types'

interface ImageStore {
  images: Image[]
  currentImage: Image | null
  userImages: Image[]
  fetchImages: () => Promise<void>
  fetchImage: (id: number) => Promise<void>
  fetchUserImages: (userName: string) => Promise<void>
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  currentImage: null,
  userImages: [],

  fetchImages: async () => {
    const { data } = await api.get<Image[]>('/images')
    set({ images: data })
  },

  fetchImage: async (id) => {
    const { data } = await api.get<Image>(`/images/${id}`)
    set({ currentImage: data })
  },

  fetchUserImages: async (userName) => {
    const { data } = await api.get<Image[]>(`/images/username/${userName}`)
    set({ userImages: data })
  },
}))
