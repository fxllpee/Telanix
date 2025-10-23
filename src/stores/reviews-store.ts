import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { reviewsApi } from '@/services/backend-api'

export interface Review {
  id: string
  movieId: number
  movie_id?: number // Backend usa snake_case
  userId: string
  user_id?: string
  userName: string
  user_name?: string
  userAvatar: string
  user_avatar?: string
  rating: number // 1-5 estrelas
  title: string
  content: string
  helpful: number // quantas pessoas marcaram como útil
  spoiler: boolean
  timestamp: number
  created_at?: string
}

interface ReviewsState {
  reviews: Review[]
  addReview: (review: Omit<Review, 'id' | 'timestamp' | 'helpful'>) => Promise<void>
  updateReview: (reviewId: string, updates: Partial<Review>) => void
  deleteReview: (reviewId: string) => Promise<void>
  getReviewsByMovie: (movieId: number) => Review[]
  getUserReviewForMovie: (movieId: number, userId: string) => Review | null
  markAsHelpful: (reviewId: string) => Promise<void>
  getTotalReviewsCount: () => number
  getUserReviewsCount: (userId: string) => number
  loadMovieReviews: (movieId: number) => Promise<void>
}

// Normalizar review do backend para formato local
function normalizeReview(backendReview: any): Review {
  return {
    id: backendReview.id,
    movieId: backendReview.movie_id,
    userId: backendReview.user_id,
    userName: backendReview.user_name,
    userAvatar: backendReview.user_avatar || '',
    rating: backendReview.rating,
    title: backendReview.title,
    content: backendReview.content,
    helpful: backendReview.helpful || 0,
    spoiler: backendReview.spoiler || false,
    timestamp: new Date(backendReview.created_at).getTime(),
  }
}

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: [],

      addReview: async (review) => {
        try {
          const response = await reviewsApi.create({
            movie_id: review.movieId,
            rating: review.rating,
            title: review.title,
            content: review.content,
            spoiler: review.spoiler,
          })

          if (response.success && response.data) {
            const normalizedReview = normalizeReview(response.data)
            set((state) => ({
              reviews: [normalizedReview, ...state.reviews],
            }))
          }
        } catch (error) {
          console.error('Erro ao adicionar review:', error)
          throw error
        }
      },

      updateReview: (reviewId, updates) => {
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === reviewId ? { ...review, ...updates } : review
          ),
        }))
      },

      deleteReview: async (reviewId) => {
        try {
          const response = await reviewsApi.delete(reviewId)
          
          if (response.success) {
            set((state) => ({
              reviews: state.reviews.filter((review) => review.id !== reviewId),
            }))
          }
        } catch (error) {
          console.error('Erro ao deletar review:', error)
          throw error
        }
      },

      loadMovieReviews: async (movieId) => {
        try {
          const response = await reviewsApi.getByMovie(movieId)
          
          if (response.success && response.data && Array.isArray(response.data)) {
            const normalizedReviews = response.data.map(normalizeReview)
            
            // Mesclar com reviews existentes, removendo duplicatas
            set((state) => {
              const existingIds = new Set(state.reviews.map(r => r.id))
              const newReviews = normalizedReviews.filter(r => !existingIds.has(r.id))
              return {
                reviews: [...newReviews, ...state.reviews]
              }
            })
          }
        } catch (error) {
          console.error('Erro ao carregar reviews:', error)
        }
      },

      markAsHelpful: async (reviewId) => {
        try {
          const response = await reviewsApi.markHelpful(reviewId)
          
          if (response.success) {
            set((state) => ({
              reviews: state.reviews.map((review) =>
                review.id === reviewId
                  ? { ...review, helpful: review.helpful + 1 }
                  : review
              ),
            }))
          }
        } catch (error) {
          console.error('Erro ao marcar como útil:', error)
        }
      },

      getReviewsByMovie: (movieId) => {
        return get().reviews
          .filter((review) => review.movieId === movieId)
          .sort((a, b) => b.helpful - a.helpful || b.timestamp - a.timestamp)
      },

      getUserReviewForMovie: (movieId, userId) => {
        return get().reviews.find(
          (review) => review.movieId === movieId && review.userId === userId
        ) || null
      },

      getTotalReviewsCount: () => {
        return get().reviews.length
      },

      getUserReviewsCount: (userId) => {
        return get().reviews.filter((review) => review.userId === userId).length
      },
    }),
    {
      name: 'telanix-reviews-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
)
