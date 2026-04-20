import { create } from 'zustand'
import api from '../lib/api'
import { Comment } from '../types'

interface CommentStore {
  comments: Comment[]
  fetchComments: (imageId: number) => Promise<void>
}

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],

  fetchComments: async (imageId) => {
    const { data } = await api.get<Comment[]>(`/comments/image/${imageId}`)
    set({ comments: data })
  },
}))
