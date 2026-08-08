import { create } from 'zustand'
import api from '@/lib/api'
import { Palette } from '@/types'

interface PaletteStore {
  palettes: Palette[]
  palettesLoading: boolean
  loaded: boolean
  fetchPalettes: () => Promise<void>
  addPalette: (name: string) => Promise<Palette>
  deletePalette: (id: number) => Promise<void>
  renamePalette: (id: number, name: string) => Promise<void>
  addColorToPalette: (id: number, color: string) => Promise<void>
  removeColorFromPalette: (id: number, color: string) => Promise<void>
}

export const usePaletteStore = create<PaletteStore>((set) => ({
  palettes: [],
  palettesLoading: false,
  loaded: false,

  fetchPalettes: async () => {
    if (usePaletteStore.getState().loaded) return
    set({ palettesLoading: true })
    try {
      const { data } = await api.get<Palette[]>('/palettes')
      set({ palettes: data, loaded: true, palettesLoading: false })
    } catch {
      set({ palettes: [], palettesLoading: false })
    }
  },

  addPalette: async (name) => {
    const { data } = await api.post<Palette>('/palettes', { name })
    set(state => ({ palettes: [...state.palettes, data] }))
    return data
  },

  deletePalette: async (id) => {
    await api.delete(`/palettes/${id}`)
    set(state => ({ palettes: state.palettes.filter(p => p.id !== id) }))
  },

  renamePalette: async (id, name) => {
    const { data } = await api.patch<Palette>(`/palettes/${id}`, { name })
    set(state => ({ palettes: state.palettes.map(p => p.id === id ? data : p) }))
  },

  addColorToPalette: async (id, color) => {
    const palette = usePaletteStore.getState().palettes.find(p => p.id === id)
    if (!palette) return
    if (palette.colors.includes(color)) return
    const colors = [...palette.colors, color]
    const { data } = await api.patch<Palette>(`/palettes/${id}`, { colors })
    set(state => ({ palettes: state.palettes.map(p => p.id === id ? data : p) }))
  },

  removeColorFromPalette: async (id, color) => {
    const palette = usePaletteStore.getState().palettes.find(p => p.id === id)
    if (!palette) return
    const colors = palette.colors.filter(c => c !== color)
    const { data } = await api.patch<Palette>(`/palettes/${id}`, { colors })
    set(state => ({ palettes: state.palettes.map(p => p.id === id ? data : p) }))
  },
}))
