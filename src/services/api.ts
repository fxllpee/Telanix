import {
  Movie,
  MovieDetails,
  PaginatedResponse,
  Person,
  WatchProvidersResponse,
} from '@/types'
import { useMovieStore } from '@/stores/movie-store'
const API_BASE_URL = 'https://api.themoviedb.org/3'
  const BEARER_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZjUwODBlMzQwZTcyYjg4ODAxZWIxNjFjZjllMjUwNCIsIm5iZiI6MTc1NDkzNDIzNi42OTkwMDAxLCJzdWIiOiI2ODlhMmJkYzhjYWNhMDMxNTA1ZTNhMzciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.-HaBfS7vDo6wsGsy7S74E0k8w50jbE4657xiUyRa5hw'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${BEARER_TOKEN}`,
  },
}

const CACHE_TTL_MS = 1 * 60 * 1000 // Reduzido para 1 minuto para evitar cache corrompido
const memoryCache = new Map<string, { expires: number; data: any }>()

async function apiFetch<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}/${endpoint}`
  const now = Date.now()
  const cached = memoryCache.get(url)
  if (cached && cached.expires > now) {
    return cached.data as T
  }
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`)
  }
  const data = (await response.json()) as T
  memoryCache.set(url, { expires: now + CACHE_TTL_MS, data })
  return data
}

// Função para limpar cache
export const clearApiCache = () => {
  memoryCache.clear()
  console.log('API cache cleared')
}

interface ReleaseDateResponse {
  id: number
  results: {
    iso_3166_1: string
    release_dates: {
      certification: string
      iso_639_1: string | null
      note: string
      release_date: string
      type: number
    }[]
  }[]
}

export interface DiscoverFilters {
  with_genres?: string
  primary_release_year?: string
  with_crew?: string
  'certification.lte'?: string
  with_origin_country?: string
  'primary_release_date.gte'?: string
  'primary_release_date.lte'?: string
  'with_runtime.gte'?: string
  'with_runtime.lte'?: string
}

const palavrasProibidas = [
  'porn',
  'porno',
  'xxx',
  'erotic',
  'erotica',
  'nude',
  'naked',
  'sex',
  'sexual',
  'strip',
  'stripper',
  'adult film',
  'hardcore',
  'softcore',
  'fetish',
  'masturbation',
  'orgasm',
  'penetration',
  'threesome',
  'gangbang',
  'nymphomaniac',
  'blue is the warmest color',
  'fifty shades',
  'showgirls',
  'emanuelle',
  'caligula',
  'nana',
  'sexo',
  'sexual',
  'erótico',
  'erótica',
  'pornô',
  'pornográfico',
  'nudez',
  'stripper',
  'prostituição',
  'orgia',
]

const generosProibidos: number[] = [10770] // ID for 'TV Movie'

const contemConteudoInadequado = (movie: Movie | MovieDetails): boolean => {
  if (!movie.poster_path) return true
  if (movie.vote_average < 3.0 && movie.vote_count > 50) return true

  const textToCheck = `
    ${movie.title.toLowerCase()} 
    ${movie.original_title.toLowerCase()} 
    ${movie.overview.toLowerCase()}
  `
  if (palavrasProibidas.some((word) => textToCheck.includes(word))) return true

  const movieGenreIds = movie.genre_ids || movie.genres.map((g) => g.id)
  if (movieGenreIds.some((id) => generosProibidos.includes(id))) return true

  return false
}

const filterInappropriateMovies = (movies: Movie[]): Movie[] => {
  return movies.filter((movie) => !contemConteudoInadequado(movie))
}

const filterRemovedMovies = <T extends { id: number }>(items: T[]): T[] => {
  const { removedMovieIds } = useMovieStore.getState()
  if (!removedMovieIds || removedMovieIds.length === 0) {
    return items
  }
  return items.filter((item) => !removedMovieIds.includes(item.id))
}

const filterJapaneseMoviesByHalf = (movies: Movie[]): Movie[] => {
  const japaneseMovies = movies.filter(
    (movie) => movie.original_language === 'ja',
  )
  const otherMovies = movies.filter((movie) => movie.original_language !== 'ja')
  const halfJapaneseMovies = japaneseMovies.slice(
    0,
    Math.ceil(japaneseMovies.length / 2),
  )
  return [...otherMovies, ...halfJapaneseMovies]
}

const enrichWithCertifications = async (movies: Movie[]): Promise<Movie[]> => {
  return Promise.all(
    movies.map(async (m) => {
      try {
        const cert = await getMovieCertification(m.id)
        return { ...m, certification: cert || m.certification }
      } catch {
        return m
      }
    }),
  )
}

export const searchMovies = async (
  query: string,
  page = 1,
): Promise<PaginatedResponse<Movie>> => {
  const params = new URLSearchParams({
    query,
    include_adult: 'false',
    language: 'pt-BR',
    page: String(page),
  })
  const data = await apiFetch<PaginatedResponse<Movie>>(
    `search/movie?${params.toString()}`,
  )
  data.results = filterInappropriateMovies(data.results)
  data.results = filterRemovedMovies(data.results)
  data.results = await enrichWithCertifications(data.results)
  return data
}

export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  const { removedMovieIds } = useMovieStore.getState()
  if (removedMovieIds.includes(id)) {
    throw new Error('Filme não encontrado ou removido.')
  }

  const params = new URLSearchParams({
    language: 'pt-BR',
    append_to_response: 'credits,videos,release_dates',
  })
  const movie = await apiFetch<
    MovieDetails & { release_dates: ReleaseDateResponse }
  >(`movie/${id}?${params.toString()}`)
  if (contemConteudoInadequado(movie)) {
    throw new Error('Conteúdo do filme é considerado inadequado.')
  }

  let certification: string | undefined
  const releaseDates = movie.release_dates
  if (releaseDates) {
    const brazilRelease = releaseDates.results.find(
      (r) => r.iso_3166_1 === 'BR',
    )
    if (brazilRelease && brazilRelease.release_dates.length > 0) {
      const theatricalRelease = brazilRelease.release_dates.find(
        (rd) => rd.type === 3,
      )
      const certValue = theatricalRelease?.certification
      if (certValue === '') {
        certification = 'L'
      } else if (certValue) {
        certification = certValue
      }
    }
  }
  movie.certification = certification

  return movie
}

export const getMovieDetailsBatch = async (
  ids: number[],
): Promise<MovieDetails[]> => {
  const safeIds = Array.from(new Set(ids)).slice(0, 20)
  const results: MovieDetails[] = []
  for (const id of safeIds) {
    try {
      const m = await getMovieDetails(id)
      results.push(m)
    } catch {
      // ignore single failure
    }
  }
  return results
}

export const getPopularMovies = async (
  page = 1,
  options?: { filterJapanese?: boolean },
): Promise<PaginatedResponse<Movie>> => {
  const params = new URLSearchParams({ language: 'pt-BR', page: String(page) })
  const data = await apiFetch<PaginatedResponse<Movie>>(
    `movie/popular?${params.toString()}`,
  )
  data.results = filterInappropriateMovies(data.results)
  if (options?.filterJapanese) {
    data.results = filterJapaneseMoviesByHalf(data.results)
  }
  data.results = filterRemovedMovies(data.results)
  data.results = await enrichWithCertifications(data.results)
  return data
}

export const getTopRatedMovies = async (
  page = 1,
): Promise<PaginatedResponse<Movie>> => {
  const params = new URLSearchParams({ language: 'pt-BR', page: String(page) })
  const data = await apiFetch<PaginatedResponse<Movie>>(
    `movie/top_rated?${params.toString()}`,
  )
  data.results = filterInappropriateMovies(data.results)
  data.results = filterRemovedMovies(data.results)
  data.results = await enrichWithCertifications(data.results)
  return data
}

export const getNowPlayingMovies = async (
  page = 1,
): Promise<PaginatedResponse<Movie>> => {
  const params = new URLSearchParams({ language: 'pt-BR', page: String(page) })
  const data = await apiFetch<PaginatedResponse<Movie>>(
    `movie/now_playing?${params.toString()}`,
  )
  data.results = filterInappropriateMovies(data.results)
  data.results = filterRemovedMovies(data.results)
  data.results = await enrichWithCertifications(data.results)
  return data
}

export const getSimilarMovies = async (
  id: number,
  page = 1,
): Promise<PaginatedResponse<Movie>> => {
  const params = new URLSearchParams({ language: 'pt-BR', page: String(page) })
  const data = await apiFetch<PaginatedResponse<Movie>>(
    `movie/${id}/similar?${params.toString()}`,
  )
  data.results = filterInappropriateMovies(data.results)
  data.results = filterRemovedMovies(data.results)
  data.results = await enrichWithCertifications(data.results)
  return data
}

export const getMoviesByGenre = async (
  genreId: number,
  page = 1,
  options?: { filterJapanese?: boolean },
): Promise<PaginatedResponse<Movie>> => {
  const params = new URLSearchParams({
    with_genres: String(genreId),
    include_adult: 'false',
    language: 'pt-BR',
    page: String(page),
    sort_by: 'popularity.desc',
  })
  const data = await apiFetch<PaginatedResponse<Movie>>(
    `discover/movie?${params.toString()}`,
  )
  data.results = filterInappropriateMovies(data.results)
  if (options?.filterJapanese) {
    data.results = filterJapaneseMoviesByHalf(data.results)
  }
  data.results = filterRemovedMovies(data.results)
  data.results = await enrichWithCertifications(data.results)
  return data
}

export const discoverMovies = async (
  filters: DiscoverFilters,
  page = 1,
): Promise<PaginatedResponse<Movie>> => {
  const queryParams: Record<string, string> = {
    certification_country: 'BR',
    language: 'pt-BR',
    sort_by: 'popularity.desc',
    page: String(page),
    include_adult: 'false',
    'certification.lte': filters['certification.lte'] || '18',
  }

  if (filters.with_genres) queryParams.with_genres = filters.with_genres
  if (filters.primary_release_year)
    queryParams.primary_release_year = filters.primary_release_year
  if (filters.with_crew) queryParams.with_crew = filters.with_crew
  if (filters.with_origin_country) queryParams.with_origin_country = filters.with_origin_country
  if (filters['primary_release_date.gte']) queryParams['primary_release_date.gte'] = filters['primary_release_date.gte']
  if (filters['primary_release_date.lte']) queryParams['primary_release_date.lte'] = filters['primary_release_date.lte']
  if (filters['with_runtime.gte']) queryParams['with_runtime.gte'] = filters['with_runtime.gte']
  if (filters['with_runtime.lte']) queryParams['with_runtime.lte'] = filters['with_runtime.lte']

  const params = new URLSearchParams(queryParams)
  const response = await apiFetch<PaginatedResponse<Movie>>(
    `discover/movie?${params.toString()}`,
  )

  response.results = filterInappropriateMovies(response.results)
  response.results = filterRemovedMovies(response.results)
  response.results = await enrichWithCertifications(response.results)
  return response
}


export const getMovieCertification = async (
  movieId: number,
): Promise<string | null> => {
  try {
    const data = await apiFetch<ReleaseDateResponse>(
      `movie/${movieId}/release_dates`,
    )
    const brazilRelease = data.results.find((r) => r.iso_3166_1 === 'BR')
    if (brazilRelease && brazilRelease.release_dates.length > 0) {
      const theatricalRelease = brazilRelease.release_dates.find((rd) => rd.type === 3) || brazilRelease.release_dates[0]
      const certification = theatricalRelease?.certification
      if (certification === '') return 'L'
      if (certification) return certification
    }
    return null
  } catch (error) {
    console.error(`Failed to fetch certification for movie ${movieId}:`, error)
    return null
  }
}

export const getMovieCertificationWithNote = async (
  movieId: number,
): Promise<{ certification: string | null; note: string | null }> => {
  try {
    const data = await apiFetch<ReleaseDateResponse>(
      `movie/${movieId}/release_dates`,
    )
    const brazilRelease = data.results.find((r) => r.iso_3166_1 === 'BR')
    if (brazilRelease && brazilRelease.release_dates.length > 0) {
      const theatricalRelease = brazilRelease.release_dates.find((rd) => rd.type === 3) || brazilRelease.release_dates[0]
      let certification = theatricalRelease?.certification || null
      if (certification === '') certification = 'L'
      const note = theatricalRelease?.note || null
      return { certification, note }
    }
    return { certification: null, note: null }
  } catch (error) {
    console.error(`Failed to fetch certification for movie ${movieId}:`, error)
    return { certification: null, note: null }
  }
}

export const getWatchProviders = (
  movieId: number,
): Promise<WatchProvidersResponse> => {
  return apiFetch(`movie/${movieId}/watch/providers`)
}

export const getImageUrl = (
  path: string | null,
  size: 'w300' | 'w500' | 'w780' | 'original' = 'w500',
) => {
  if (!path) {
    return 'https://img.usecurling.com/p/500/750?q=movie&color=black'
  }
  // URL base das imagens do TMDB (https://developer.themoviedb.org/docs/image-basics)
  const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export const getProfileImageUrl = (
  path: string | null,
  size: 'w185' | 'h632' | 'original' = 'w185',
) => {
  if (!path) {
    return 'https://img.usecurling.com/ppl/thumbnail'
  }
  // URL base das imagens do TMDB
  const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export const searchPeople = (
  query: string,
  page = 1,
): Promise<PaginatedResponse<Person>> => {
  const params = new URLSearchParams({
    query,
    include_adult: 'false',
    language: 'pt-BR',
    page: String(page),
  })
  return apiFetch(`search/person?${params.toString()}`)
}

