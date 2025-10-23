import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Theme = 'dark' | 'system'

interface SettingsState {
  // Aparência
  theme: Theme
  setTheme: (theme: Theme) => void
  
  // Notificações
  notifications: {
    enabled: boolean
    newReleases: boolean
    recommendations: boolean
  }
  setNotifications: (notifications: Partial<SettingsState['notifications']>) => void
  
  // Reprodução
  autoplay: boolean
  setAutoplay: (autoplay: boolean) => void
  
  // Filtros de conteúdo
  contentFilters: {
    hideAdultContent: boolean
    minRatingEnabled: boolean
    minRating: number
  }
  setContentFilters: (filters: Partial<SettingsState['contentFilters']>) => void
  
  // Reset
  resetSettings: () => void
}

const defaultSettings = {
  theme: 'dark' as Theme,
  notifications: {
    enabled: true,
    newReleases: true,
    recommendations: true,
  },
  autoplay: true,
  contentFilters: {
    hideAdultContent: true,
    minRatingEnabled: false,
    minRating: 0,
  },
}

// Função auxiliar para aplicar o tema
const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark'
    root.classList.remove('light', 'dark')
    root.classList.add(systemTheme)
  } else {
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
      
      setNotifications: (notifications) => 
        set((state) => ({ 
          notifications: { ...state.notifications, ...notifications } 
        })),
      
      setAutoplay: (autoplay) => set({ autoplay }),
      
      setContentFilters: (filters) =>
        set((state) => ({
          contentFilters: { ...state.contentFilters, ...filters }
        })),
      
      resetSettings: () => {
        set(defaultSettings)
        applyTheme(defaultSettings.theme)
      },
    }),
    {
      name: 'telanix-settings-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        // Aplica o tema quando o app carrega
        if (state) {
          applyTheme(state.theme)
        }
      },
    }
  )
)

