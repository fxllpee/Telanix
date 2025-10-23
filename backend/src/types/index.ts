// Types for TelaNix Backend API

export interface User {
  id: string
  email: string
  password?: string // Não retornar em responses
  name: string
  avatar_url?: string
  bio?: string
  created_at: Date
  updated_at: Date
  is_active: boolean
}

export interface UserStats {
  user_id: string
  total_ratings: number
  total_reviews: number
  total_likes: number
  join_date: Date
  last_login?: Date
}

export interface Review {
  id: string
  movie_id: number
  user_id: string
  user_name: string
  user_avatar?: string
  rating: number
  title: string
  content: string
  helpful: number
  spoiler: boolean
  created_at: Date
  updated_at: Date
}

export interface Rating {
  user_id: string
  movie_id: number
  rating: number
  updated_at: Date
}

export interface Like {
  user_id: string
  movie_id: number
  updated_at: Date
}

// Request/Response types
export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: Omit<User, 'password'>
  token?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

