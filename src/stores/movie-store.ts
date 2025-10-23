import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface MovieStoreState {
  removedMovieIds: number[]
  removeMovie: (id: number) => void
}

export const useMovieStore = create<MovieStoreState>()(
  persist(
    (set) => ({
      removedMovieIds: [],
      removeMovie: (id: number) => {
        set((state) => ({
          removedMovieIds: [...new Set([...state.removedMovieIds, id])],
        }))
      },
    }),
    {
      name: 'telanix-movie-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
