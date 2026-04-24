import { create } from 'zustand'
import api from '@/lib/api'
import { Comment } from '@/types'

interface CommentStore {
  comments: Comment[]
  fetchComments: (imageId: number) => Promise<void>
  postComment: (imageId: number, comment: string) => Promise<void>
  deleteComment: (id: number) => Promise<void>
}

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],

  fetchComments: async (imageId) => {
    const { data } = await api.get<Comment[]>(`/comments/image/${imageId}`)
    set({ comments: data })
  },

  postComment: async (imageId, comment) => {
    const { data } = await api.post<Comment>('/comments', { userId: 1, imageId, comment })
    set(state => ({ comments: [...state.comments, data] }))
  },

  deleteComment: async (id) => {
    await api.delete(`/comments/${id}`)
    set(state => ({ comments: state.comments.filter(c => c.id !== id) }))
  },
}))
