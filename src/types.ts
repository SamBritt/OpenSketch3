export interface Image {
  id: number
  userId: number
  userName: string
  name: string
  description: string
  imageUrl: string
  likes: number
  views: number
}

export interface Comment {
  id: number
  userId: number
  imageId: number
  comment: string
}

export interface User {
  id: number
  userName: string
  firstName: string
  lastName: string
}
