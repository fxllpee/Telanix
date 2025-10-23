import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MovieCard } from '@/components/MovieCard'
import { PersonCard } from '@/components/PersonCard'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { searchMovies, searchPeople } from '@/services/api'
import { Movie, Person } from '@/types'
import { Search as SearchIcon, X, Mic, Frown } from 'lucide-react'

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [searchType, setSearchType] = useState(
    searchParams.get('type') || 'movie',
  )

  const [movieResults, setMovieResults] = useState<Movie[]>([])
  const [personResults, setPersonResults] = useState<Person[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const currentPage = Number(searchParams.get('page')) || 1

  const recentSearches = ['Duna', 'Ficção Científica', 'Interestelar']
  const trendingSearches = ['Ação', 'Aventura', 'Drama']

  const handleSearch = useCallback(
    async (query: string, type: string, page: number) => {
      if (!query) {
        setMovieResults([])
        setPersonResults([])
        setTotalPages(0)
        return
      }
      setIsLoading(true)
      setError(null)
      try {
        if (type === 'movie') {
          const data = await searchMovies(query, page)
          setMovieResults(data.results)
          setTotalPages(data.total_pages)
          setPersonResults([])
        } else {
          const data = await searchPeople(query, page)
          // Filtrar pessoas com nomes muito genéricos ou suspeitos
          const filteredResults = data.results.filter(person => 
            person.name && 
            person.name.length > 2 && 
            !person.name.toLowerCase().includes('test') &&
            !person.name.toLowerCase().includes('fake') &&
            !person.name.toLowerCase().includes('demo') &&
            person.profile_path // Só mostrar pessoas com foto real
          )
          setPersonResults(filteredResults)
          setTotalPages(data.total_pages)
          setMovieResults([])
        }
      } catch (err) {
        setError('Falha ao buscar. Tente novamente mais tarde.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    },
    [setMovieResults, setPersonResults, setTotalPages, setIsLoading, setError],
  )

  useEffect(() => {
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'movie'
    if (query) {
      setSearchTerm(query)
      setSearchType(type)
      handleSearch(query, type, currentPage)
    }
  }, [searchParams, currentPage, handleSearch])

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams({ q: searchTerm, type: searchType, page: '1' })
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setSearchParams({
        q: searchTerm,
        type: searchType,
        page: String(newPage),
      })
      window.scrollTo(0, 0)
    }
  }

  const handleTagClick = (tag: string) => {
    setSearchTerm(tag)
    setSearchParams({ q: tag, type: searchType, page: '1' })
  }

  const handleTabChange = (value: string) => {
    setSearchType(value)
    if (searchTerm) {
      setSearchParams({ q: searchTerm, type: value, page: '1' })
    }
  }

  const renderPagination = () =>
    totalPages > 1 && (
      <Pagination className="mt-12">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(currentPage - 1)
              }}
              className={
                currentPage === 1 ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-4 py-2 text-sm">
              Página {currentPage} de {totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(currentPage + 1)
              }}
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )

  const renderContent = () => {
    if (isLoading) {
      const skeletonCount = searchType === 'movie' ? 12 : 6
      const SkeletonComponent =
        searchType === 'movie' ? (
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
        ) : (
          <div className="flex flex-col items-center gap-4 p-4">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        )

      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i}>{SkeletonComponent}</div>
          ))}
        </div>
      )
    }
    if (error) {
      return (
        <div className="text-center text-destructive mt-16">
          <Frown className="mx-auto h-12 w-12" />
          <p className="mt-4">{error}</p>
        </div>
      )
    }
    if (searchType === 'movie' && movieResults.length > 0) {
      return (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movieResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {renderPagination()}
        </>
      )
    }
    if (searchType === 'person' && personResults.length > 0) {
      return (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {personResults.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
          {renderPagination()}
        </>
      )
    }
    if (searchParams.get('q')) {
      return (
        <p className="text-center text-secondary mt-16">
          Nenhum resultado encontrado para "{searchParams.get('q')}".
        </p>
      )
    }
    return null
  }

  return (
    <div className="container px-4 pt-28 min-h-screen animate-fade-in-up">
      <form onSubmit={onSearchSubmit} className="relative max-w-2xl mx-auto">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
        <Input
          type="text"
          placeholder="Buscar filmes, pessoas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-14 pl-12 pr-24 rounded-full bg-card border-2 border-accent-1/20 focus:ring-accent-1 focus:border-accent-1 text-lg"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => {
                setSearchTerm('')
                setSearchParams({})
                setMovieResults([])
                setPersonResults([])
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full text-accent-1 hover:bg-accent-1/10 hover:text-accent-1"
          >
            <Mic className="h-5 w-5" />
          </Button>
        </div>
      </form>

      <Tabs
        value={searchType}
        onValueChange={handleTabChange}
        className="max-w-2xl mx-auto mt-8"
      >
        <TabsList className="grid w-full grid-cols-2 bg-card border border-accent-1/10">
          <TabsTrigger value="movie">Filmes</TabsTrigger>
          <TabsTrigger value="person">Pessoas</TabsTrigger>
        </TabsList>
      </Tabs>

      {!searchParams.get('q') ? (
        <div className="max-w-2xl mx-auto mt-12 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-semibold text-secondary mb-4">
              Buscas Recentes
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="px-3 py-1 rounded-full bg-card text-foreground hover:bg-accent-1/20"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-secondary mb-4">
              Buscas em Alta
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="px-3 py-1 rounded-full bg-card text-foreground hover:bg-accent-1/20"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            Resultados para "{searchParams.get('q')}"
          </h2>
          {renderContent()}
        </div>
      )}
    </div>
  )
}

export default SearchPage

