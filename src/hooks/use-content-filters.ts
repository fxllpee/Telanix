import { useCallback } from 'react'
import { useSettingsStore } from '@/stores/settings-store'
import { Movie } from '@/types'

export const useContentFilters = () => {
  const { contentFilters } = useSettingsStore()

  const applyFilters = useCallback((movies: Movie[]): Movie[] => {
    let filteredMovies = [...movies]

    // Filtro de conteúdo adulto
    if (contentFilters.hideAdultContent) {
      filteredMovies = filteredMovies.filter(movie => {
        // Filtrar filmes com gêneros adultos
        const adultGenres = [27, 53, 10749, 10751, 10752] // Horror, Thriller, Romance, Family, War
        const hasAdultGenre = movie.genre_ids?.some(id => adultGenres.includes(id))
        
        // Filtrar por palavras-chave no título/overview
        const adultKeywords = [
          'sexo', 'sexual', 'adulto', 'erótico', 'pornô', 'nudez',
          'violência', 'sangue', 'morte', 'assassinato', 'drogas',
          'sex', 'sexual', 'adult', 'erotic', 'porn', 'nudity',
          'violence', 'blood', 'death', 'murder', 'drugs'
        ]
        
        const textToCheck = `${movie.title} ${movie.overview}`.toLowerCase()
        const hasAdultKeyword = adultKeywords.some(keyword => textToCheck.includes(keyword))
        
        return !hasAdultGenre && !hasAdultKeyword
      })
    }

    // Filtro por avaliação mínima
    if (contentFilters.minRatingEnabled && contentFilters.minRating > 0) {
      filteredMovies = filteredMovies.filter(movie => 
        movie.vote_average >= contentFilters.minRating
      )
    }

    return filteredMovies
  }, [contentFilters])

  const getMaxAvailableRating = useCallback((movies: Movie[]): number => {
    if (movies.length === 0) return 10
    
    const maxRating = Math.max(...movies.map(movie => movie.vote_average))
    return Math.min(Math.ceil(maxRating), 10)
  }, [])

  return {
    applyFilters,
    getMaxAvailableRating,
    contentFilters
  }
}
