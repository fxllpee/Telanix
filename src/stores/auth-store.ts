import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authApi, usersApi } from '@/services/backend-api'
import { useLikesStore } from './likes-store'
import { useRatingsStore } from './ratings-store'

interface UserProfile {
  id: string
  email: string
  name?: string
  avatar_url?: string
  avatarUrl?: string // Mantém compatibilidade
  bio?: string
}

interface AuthState {
  user: UserProfile | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isAuthenticated: () => boolean
  updateProfile: (partial: Partial<UserProfile>) => void
  checkEmailExists: (email: string) => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: async (email: string, password: string) => {
        try {
          // Chamar API de login
          const response = await authApi.login(email, password)
          
          if (!response.success || !response.data?.user) {
            throw new Error(response.error || 'Erro no login')
          }

          const user = response.data.user

          // Normalizar campos (avatar_url -> avatarUrl)
          const normalizedUser = {
            ...user,
            avatarUrl: user.avatar_url || user.avatarUrl,
          }

          // Definir usuário logado
          set({ user: normalizedUser })

          // Carregar likes e ratings do usuário
          useLikesStore.getState().loadUserLikes(user.id)
          useRatingsStore.getState().loadUserRatings(user.id)
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : 'Erro no login')
        }
      },
      register: async (email: string, password: string, name: string) => {
        try {
          // Chamar API de registro
          const response = await authApi.register(email, password, name)
          
          if (!response.success || !response.data?.user) {
            throw new Error(response.error || 'Erro no cadastro')
          }

          const user = response.data.user

          // Normalizar campos
          const normalizedUser = {
            ...user,
            avatarUrl: user.avatar_url || user.avatarUrl,
          }

          // Definir usuário logado
          set({ user: normalizedUser })

          // Salvar user ID no localStorage
          localStorage.setItem('telanix-user-id', user.id)

          // Carregar likes e ratings do usuário (vazio para novo usuário)
          useLikesStore.getState().loadUserLikes(user.id)
          useRatingsStore.getState().loadUserRatings(user.id)
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : 'Erro no cadastro')
        }
      },
      logout: () => {
        // Limpar user ID do localStorage
        localStorage.removeItem('telanix-user-id')
        
        // Limpar likes ao fazer logout
        useLikesStore.getState().clearLikes()
        
        set({ user: null })
      },
      isAuthenticated: () => get().user !== null,
      updateProfile: async (partial: Partial<UserProfile>) => {
        const { user } = get()
        if (!user) return

        try {
          // Atualizar no backend
          const response = await usersApi.update(user.id, partial)
          
          if (response.success && response.data) {
            const updatedUser = {
              ...response.data,
              avatarUrl: response.data.avatar_url || response.data.avatarUrl,
            }
            set({ user: updatedUser })
          }
        } catch (error) {
          console.error('Erro ao atualizar perfil:', error)
        }
      },
      checkEmailExists: async (email: string) => {
        // Não temos endpoint específico, então sempre retorna false
        // Pode ser implementado depois se necessário
        return false
      },
    }),
    {
      name: 'telanix-auth-storage',
      storage: createJSONStorage(() => localStorage),
      version: 2, // Incrementar versão para forçar migração
    },
  ),
)


