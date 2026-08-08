export interface Image {
  id: number
  userId: number
  userName: string
  name: string
  description: string
  imageUrl?: string
  likes: number
  views: number
  liked: boolean
  avatarUrl?: string | null
}

export interface LayerMeta {
  id: string
  name: string
  visible: boolean
  opacity: number
}

export interface Palette {
  id: number
  userId: number
  name: string
  colors: string[]
}

export interface Comment {
  id: number
  userId: number
  imageId: number
  comment: string
  userName: string
  avatarUrl?: string | null
  createdAt: string
}

export interface User {
  id: number
  userName: string
  firstName: string
  lastName: string
  avatarUrl: string | null
}

export interface AuthResponse {
  token: string
  user: User
}
