import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { likesApi } from '@/services/backend-api'

interface LikesStoreState {
  likedMovieIds: number[]
  currentUserId: string | null
  toggleLike: (id: number) => Promise<void>
  isLiked: (id: number) => boolean
  loadUserLikes: (userId: string) => Promise<void>
  clearLikes: () => void
}

export const useLikesStore = create<LikesStoreState>()(
  persist(
    (set, get) => ({
      likedMovieIds: [],
      currentUserId: null,
      toggleLike: async (id: number) => {
        const { likedMovieIds, currentUserId } = get()
        
        if (!currentUserId) {
          console.warn('No user logged in, cannot toggle like')
          return
        }

        const exists = likedMovieIds.includes(id)
        
        try {
          if (exists) {
            // Remover like
            const response = await likesApi.delete(id)
            if (response.success) {
              set({ likedMovieIds: likedMovieIds.filter((m) => m !== id) })
            }
          } else {
            // Adicionar like
            const response = await likesApi.create(id)
            if (response.success) {
              set({ likedMovieIds: [...likedMovieIds, id] })
            }
          }
        } catch (error) {
          console.error('Error updating likes:', error)
        }
      },
      isLiked: (id: number) => get().likedMovieIds.includes(id),
      loadUserLikes: async (userId: string) => {
        try {
          const response = await likesApi.getByUser(userId)
          
          if (response.success && response.data) {
            set({ likedMovieIds: response.data, currentUserId: userId })
          } else {
            set({ likedMovieIds: [], currentUserId: userId })
          }
        } catch (error) {
          console.error('Erro ao carregar likes do usuário:', error)
          set({ likedMovieIds: [], currentUserId: userId })
        }
      },
      clearLikes: () => set({ likedMovieIds: [], currentUserId: null }),
    }),
    {
      name: 'telanix-likes-storage',
      storage: createJSONStorage(() => localStorage),
      version: 4, // Incrementado para forçar migração
      migrate: (persistedState: any, version: number) => {
        // Migração: limpar likes antigos quando atualizar versão
        if (version < 4) {
          return { likedMovieIds: [], currentUserId: null }
        }
        return persistedState
      },
    },
  ),
)


