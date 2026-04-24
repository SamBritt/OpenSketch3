export interface Image {
  id: number
  userId: number
  userName: string
  name: string
  description: string
  imageUrl: string
  likes: number
  views: number
  liked: boolean
}

export interface Comment {
  id: number
  userId: number
  imageId: number
  comment: string
  userName: string
}

export interface User {
  id: number
  userName: string
  firstName: string
  lastName: string
}
