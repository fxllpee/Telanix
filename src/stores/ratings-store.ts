import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ratingsApi } from '@/services/backend-api'

export interface UserRating {
  movieId: number
  rating: number // 1-5 estrelas
  timestamp: number
}

interface RatingsState {
  ratings: Record<number, UserRating>
  setRating: (movieId: number, rating: number) => Promise<void>
  getRating: (movieId: number) => number | null
  removeRating: (movieId: number) => Promise<void>
  getUserAverageRating: () => number
  getRatedMoviesCount: () => number
  loadUserRatings: (userId: string) => Promise<void>
}

export const useRatingsStore = create<RatingsState>()(
  persist(
    (set, get) => ({
      ratings: {},

      setRating: async (movieId, rating) => {
        try {
          // Salvar no backend
          const response = await ratingsApi.createOrUpdate(movieId, rating)
          
          if (response.success) {
            // Atualizar estado local
            set((state) => ({
              ratings: {
                ...state.ratings,
                [movieId]: {
                  movieId,
                  rating,
                  timestamp: Date.now(),
                },
              },
            }))
          }
        } catch (error) {
          console.error('Erro ao salvar rating:', error)
        }
      },

      getRating: (movieId) => {
        const rating = get().ratings[movieId]
        return rating ? rating.rating : null
      },

      removeRating: async (movieId) => {
        try {
          // Remover do backend
          const response = await ratingsApi.delete(movieId)
          
          if (response.success) {
            // Atualizar estado local
            set((state) => {
              const newRatings = { ...state.ratings }
              delete newRatings[movieId]
              return { ratings: newRatings }
            })
          }
        } catch (error) {
          console.error('Erro ao remover rating:', error)
        }
      },

      loadUserRatings: async (userId) => {
        try {
          const response = await ratingsApi.getByUser(userId)
          
          if (response.success && response.data && Array.isArray(response.data)) {
            // Converter array para record
            const ratingsRecord: Record<number, UserRating> = {}
            response.data.forEach((r: any) => {
              ratingsRecord[r.movie_id] = {
                movieId: r.movie_id,
                rating: r.rating,
                timestamp: new Date(r.updated_at).getTime(),
              }
            })
            set({ ratings: ratingsRecord })
          }
        } catch (error) {
          console.error('Erro ao carregar ratings:', error)
        }
      },

      getUserAverageRating: () => {
        const ratings = Object.values(get().ratings)
        if (ratings.length === 0) return 0
        const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0)
        return sum / ratings.length
      },

      getRatedMoviesCount: () => {
        return Object.keys(get().ratings).length
      },
    }),
    {
      name: 'telanix-ratings-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
)
