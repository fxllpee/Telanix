export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  genres: { id: number; name: string }[]
  runtime: number | null
  original_title: string
  original_language: string
  vote_count: number
  genre_ids?: number[]
  certification?: string
  rating_note?: string
}

export interface MovieDetails extends Movie {
  tagline: string
  production_companies: { id: number; logo_path: string | null; name: string }[]
  credits: {
    cast: CastMember[]
    crew: CrewMember[]
  }
  videos: {
    results: Video[]
  }
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface CrewMember {
  id: number
  name: string
  job: string
}

export interface Video {
  id: string
  iso_639_1: string
  iso_3166_1: string
  key: string
  name: string
  site: string
  size: number
  type: string
}

export interface PaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface Person {
  id: number
  name: string
  known_for_department: string
  profile_path: string | null
}

export interface WatchProvider {
  logo_path: string
  provider_id: number
  provider_name: string
  display_priority: number
}

export interface WatchProviderDetails {
  link: string
  flatrate?: WatchProvider[]
  rent?: WatchProvider[]
  buy?: WatchProvider[]
}

export interface WatchProvidersResponse {
  id: number
  results: {
    [countryCode: string]: WatchProviderDetails
  }
}
