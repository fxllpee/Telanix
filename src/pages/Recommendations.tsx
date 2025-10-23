import { useState, useEffect, useCallback } from 'react'
import { MovieCard } from '@/components/MovieCard'
import { genres } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getMoviesByGenre, getPopularMovies } from '@/services/api'
import { Movie } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Frown } from 'lucide-react'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'

const RecommendationsPage = () => {
  const [selectedGenre, setSelectedGenre] = useState<{
    id: number
    name: string
  } | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isMoreLoading, setIsMoreLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageTitle, setPageTitle] = useState('Populares do Momento')

  const fetchMovies = useCallback(
    async (genreId: number | null, pageNum: number) => {
      const setLoading = pageNum === 1 ? setIsLoading : setIsMoreLoading
      setLoading(true)
      if (pageNum === 1) setError(null)

      try {
        const data = genreId
          ? await getMoviesByGenre(genreId, pageNum, { filterJapanese: true })
          : await getPopularMovies(pageNum, { filterJapanese: true })

        if (data && data.results) {
          setMovies((prev) =>
            pageNum === 1 ? data.results : [...prev, ...data.results],
          )
          setTotalPages(data.total_pages)
          setPage(pageNum + 1)
        } else if (pageNum === 1) {
          setMovies([])
        }
      } catch (err) {
        setError('Falha ao buscar filmes. Tente novamente.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [setIsLoading, setIsMoreLoading, setError, setMovies, setTotalPages, setPage],
  )

  useEffect(() => {
    setPage(1)
    setMovies([])
    setTotalPages(0)
    setPageTitle(
      selectedGenre
        ? `Mostrando filmes de: ${selectedGenre.name}`
        : 'Populares do Momento',
    )
    fetchMovies(selectedGenre?.id || null, 1)
  }, [selectedGenre, fetchMovies])

  const { lastElementRef } = useInfiniteScroll({
    loading: isMoreLoading,
    hasNextPage: page <= totalPages,
    onLoadMore: () => fetchMovies(selectedGenre?.id || null, page),
  })

  const renderMovies = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 18 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
          ))}
        </div>
      )
    }
    if (error && movies.length === 0) {
      return (
        <div className="text-center text-destructive mt-16">
          <Frown className="mx-auto h-12 w-12" />
          <p className="mt-4">{error}</p>
        </div>
      )
    }
    if (movies.length > 0) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              ref={index === movies.length - 1 ? lastElementRef : null}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )
    }
    return (
      <p className="text-center text-secondary mt-16">
        Nenhum filme encontrado.
      </p>
    )
  }

  return (
    <div className="container px-4 pt-28 min-h-screen animate-fade-in-up">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-1">
          Descubra Novos Filmes
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-secondary">
          Explore os filmes mais populares ou filtre por seu gênero favorito.
        </p>
      </header>

      <section className="mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {genres.map((genre) => (
            <Button
              key={genre.id}
              variant="outline"
              onClick={() => setSelectedGenre(genre)}
              className={cn(
                'rounded-full border-accent-1 text-accent-1 transition-all duration-300 hover:bg-accent-1 hover:text-primary-foreground',
                selectedGenre?.id === genre.id
                  ? 'bg-accent-1 text-primary-foreground'
                  : 'bg-transparent',
              )}
            >
              {genre.name}
            </Button>
          ))}
          {selectedGenre && (
            <Button
              variant="ghost"
              onClick={() => setSelectedGenre(null)}
              className="rounded-full text-secondary hover:bg-secondary/10 hover:text-foreground"
            >
              Limpar Filtro
            </Button>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-accent-1/90">
          {pageTitle}
        </h2>
        {renderMovies()}
        {isMoreLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={`loading-${i}`}
                className="aspect-[2/3] w-full rounded-lg"
              />
            ))}
          </div>
        )}
        {!isMoreLoading && page > totalPages && totalPages > 0 && (
          <p className="text-center text-secondary mt-8 font-semibold">
            Você chegou ao fim dos resultados!
          </p>
        )}
      </section>
    </div>
  )
}

export default RecommendationsPage
