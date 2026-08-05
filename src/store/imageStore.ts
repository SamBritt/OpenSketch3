import { create } from 'zustand'
import api from '@/lib/api'
import { Image } from '@/types'

interface ImageStore {
  images: Image[]
  imagesLoading: boolean
  currentImage: Image | null
  currentImageLoading: boolean
  userImages: Image[]
  loadedUserName: string | null
  fetchImages: () => Promise<void>
  fetchImage: (id: number) => Promise<void>
  fetchUserImages: (userName: string) => Promise<void>
  cacheImageUrl: (id: number, url: string) => void
  likeImage: (id: number) => Promise<void>
  unlikeImage: (id: number) => Promise<void>
}

const updateImage = (state: ImageStore, id: number, data: Image) => ({
  currentImage: state.currentImage?.id === id ? data : state.currentImage,
  images: state.images.map(img => img.id === id ? data : img),
  userImages: state.userImages.map(img => img.id === id ? data : img),
})

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  imagesLoading: false,
  currentImage: null,
  currentImageLoading: false,
  userImages: [],
  loadedUserName: null,

  fetchImages: async () => {
    if (useImageStore.getState().images.length > 0) return
    set({ imagesLoading: true })
    try {
      const { data } = await api.get<Image[]>('/images')
      set({ images: data, imagesLoading: false })
    } catch {
      set({ images: [], imagesLoading: false })
    }
  },

  fetchImage: async (id) => {
    if (useImageStore.getState().currentImage?.id === id) return
    set({ currentImageLoading: true, currentImage: null })
    try {
      const { data } = await api.get<Image>(`/images/${id}`)
      set({ currentImage: data, currentImageLoading: false })
    } catch {
      set({ currentImage: null, currentImageLoading: false })
    }
  },

  fetchUserImages: async (userName) => {
    const { loadedUserName } = useImageStore.getState()
    if (loadedUserName === userName) return
    try {
      const { data } = await api.get<Image[]>(`/images/username/${userName}`)
      set({ userImages: data, loadedUserName: userName })
    } catch {
      set({ userImages: [], loadedUserName: null })
    }
  },

  cacheImageUrl: (id, url) => {
    const patch = (img: Image) => img.id === id ? { ...img, imageUrl: url } : img
    set(state => ({
      images: state.images.map(patch),
      userImages: state.userImages.map(patch),
    }))
  },

  likeImage: async (id) => {
    const { data } = await api.post<Image>(`/images/${id}/like`)
    set(state => updateImage(state, id, data))
  },

  unlikeImage: async (id) => {
    const { data } = await api.delete<Image>(`/images/${id}/like`)
    set(state => updateImage(state, id, data))
  },
}))
