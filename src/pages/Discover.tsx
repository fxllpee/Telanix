import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Film } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { MovieCard } from '@/components/MovieCard'
import { Skeleton } from '@/components/ui/skeleton'
import { genres } from '@/lib/mock-data'
import { discoverMovies, searchPeople, DiscoverFilters, getPopularMovies, getTopRatedMovies, getNowPlayingMovies } from '@/services/api'
import { Movie } from '@/types'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { useContentFilters } from '@/hooks/use-content-filters'

const ageRatings = [
  { value: 'L', label: 'Livre para todos os públicos' },
  { value: '10', label: 'Não recomendado para menores de 10 anos' },
  { value: '12', label: 'Não recomendado para menores de 12 anos' },
  { value: '14', label: 'Não recomendado para menores de 14 anos' },
  { value: '16', label: 'Não recomendado para menores de 16 anos' },
  { value: '18', label: 'Não recomendado para menores de 18 anos' },
]

const countries = [
  { value: 'US', label: 'Estados Unidos' },
  { value: 'BR', label: 'Brasil' },
  { value: 'GB', label: 'Reino Unido' },
  { value: 'FR', label: 'França' },
  { value: 'JP', label: 'Japão' },
  { value: 'KR', label: 'Coreia do Sul' },
  { value: 'IT', label: 'Itália' },
  { value: 'ES', label: 'Espanha' },
  { value: 'DE', label: 'Alemanha' },
  { value: 'CA', label: 'Canadá' },
  { value: 'IN', label: 'Índia' },
  { value: 'MX', label: 'México' },
  { value: 'AR', label: 'Argentina' },
]

const decades = [
  { value: '2020s', label: '2020s', start: 2020, end: 2029 },
  { value: '2010s', label: '2010s', start: 2010, end: 2019 },
  { value: '2000s', label: '2000s', start: 2000, end: 2009 },
  { value: '1990s', label: '1990s', start: 1990, end: 1999 },
  { value: '1980s', label: '1980s', start: 1980, end: 1989 },
  { value: '1970s', label: '1970s', start: 1970, end: 1979 },
  { value: '1960s', label: '1960s', start: 1960, end: 1969 },
  { value: '1950s', label: '1950s', start: 1950, end: 1959 },
]

const DiscoverPage = () => {
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    director: '',
    certification: '',
    country: '',
    decade: '',
    minDuration: '',
    maxDuration: '',
  })
  const [discoveredMovies, setDiscoveredMovies] = useState<Movie[]>([])
  const [isDiscoverLoading, setIsDiscoverLoading] = useState(false)
  const [isMoreLoading, setIsMoreLoading] = useState(false)
  const [discoverError, setDiscoverError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [currentApiFilters, setCurrentApiFilters] =
    useState<DiscoverFilters | null>(null)
  const [suggestionReasons, setSuggestionReasons] = useState<Record<number, string>>({})

  const loadMoreMovies = useCallback(async () => {
    if (isMoreLoading || page > totalPages || !currentApiFilters) return

    setIsMoreLoading(true)
    try {
      const data = await discoverMovies(currentApiFilters, page)
      setDiscoveredMovies((prev) => [...prev, ...data.results])
      setPage((prev) => prev + 1)
    } catch (err) {
      toast.error('Erro ao carregar mais filmes.')
      console.error(err)
    } finally {
      setIsMoreLoading(false)
    }
  }, [page, totalPages, isMoreLoading, currentApiFilters])

  const { lastElementRef } = useInfiniteScroll({
    loading: isMoreLoading,
    hasNextPage: totalPages > 0 && page <= totalPages,
    onLoadMore: loadMoreMovies,
    rootMargin: '400px',
  })

  const handleDiscover = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsDiscoverLoading(true)
    setDiscoverError(null)
    setPage(1)
    setTotalPages(0)
    setDiscoveredMovies([])

    try {
      let directorId = ''
      if (filters.director.trim()) {
        const peopleResult = await searchPeople(filters.director.trim())
        const director = peopleResult.results.find(
          (p) => p.known_for_department === 'Directing',
        )
        if (director) {
          directorId = String(director.id)
        } else {
          toast.warning(
            `Diretor "${filters.director}" não encontrado. Buscando sem este filtro.`,
          )
        }
      }

      const apiFilters: DiscoverFilters = {}
      if (filters.genre) apiFilters.with_genres = filters.genre
      if (filters.year) apiFilters.primary_release_year = filters.year
      if (directorId) apiFilters.with_crew = directorId
      if (filters.certification)
        apiFilters['certification.lte'] = filters.certification
      if (filters.country && filters.country.trim()) apiFilters.with_origin_country = filters.country
      
      // Filtro por década
      if (filters.decade && filters.decade.trim()) {
        const decadeObj = decades.find(d => d.value === filters.decade)
        if (decadeObj) {
          apiFilters['primary_release_date.gte'] = `${decadeObj.start}-01-01`
          apiFilters['primary_release_date.lte'] = `${decadeObj.end}-12-31`
        }
      }
      
      // Filtro por duração
      if (filters.minDuration && filters.minDuration.trim() && !isNaN(Number(filters.minDuration))) {
        apiFilters['with_runtime.gte'] = filters.minDuration
      }
      if (filters.maxDuration && filters.maxDuration.trim() && !isNaN(Number(filters.maxDuration))) {
        apiFilters['with_runtime.lte'] = filters.maxDuration
      }

      console.log('Filtros aplicados:', apiFilters)
      setCurrentApiFilters(apiFilters)

      const data = await discoverMovies(apiFilters, 1)
      setDiscoveredMovies(data.results)
      setTotalPages(data.total_pages)
      setPage(2)
    } catch (err) {
      setDiscoverError('Ocorreu um erro ao buscar os filmes. Tente novamente.')
      toast.error('Ocorreu um erro ao buscar os filmes.')
      console.error(err)
    } finally {
      setIsDiscoverLoading(false)
    }
  }

  const handleFilterChange = <K extends keyof typeof filters>(
    filterName: K,
    value: (typeof filters)[K],
  ) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }))
  }

  // Vibes (filtros rápidos)
  const vibes: { label: string; apply: (f: typeof filters) => typeof filters }[] = [
    {
      label: 'Tranquilo',
      apply: (f) => ({ ...f, genre: '18', certification: '12' }), // Drama leve
    },
    {
      label: 'Ação',
      apply: (f) => ({ ...f, genre: '28', certification: '16' }),
    },
    {
      label: 'Família',
      apply: (f) => ({ ...f, genre: '10751', certification: '10' }),
    },
    {
      label: 'Terror leve',
      apply: (f) => ({ ...f, genre: '27', certification: '14' }),
    },
    {
      label: 'Clássicos',
      apply: (f) => ({ ...f, year: '1999' }),
    },
  ]

  const onVibeClick = async (idx: number) => {
    const next = vibes[idx].apply(filters)
    setFilters(next)
    // dispara busca com os filtros atualizados
    await new Promise((r) => setTimeout(r))
    const fakeEvent = { preventDefault: () => {} } as unknown as React.FormEvent
    await handleDiscover(fakeEvent)
  }

  // Decida por mim – 3 sugestões rápidas
  const decideForMe = async () => {
    setIsDiscoverLoading(true)
    setDiscoverError(null)
    try {
      const [popular, top, now] = await Promise.all([
        getPopularMovies(1),
        getTopRatedMovies(1),
        getNowPlayingMovies(1),
      ])
      const pool = [
        ...((popular?.results || []).map((m) => ({ movie: m, reason: 'Popular no Brasil' }))),
        ...((top?.results || []).map((m) => ({ movie: m, reason: 'Mais bem avaliados' }))),
        ...((now?.results || []).map((m) => ({ movie: m, reason: 'Em cartaz' }))),
      ]
      const pick = (arr: typeof pool, n: number) => {
        const copy = [...arr]
        const out: typeof pool = []
        while (copy.length && out.length < n) {
          const i = Math.floor(Math.random() * copy.length)
          out.push(copy.splice(i, 1)[0])
        }
        return out
      }
      const suggestions = pick(pool, 3)
      setDiscoveredMovies(suggestions.map((s) => s.movie))
      const reasons: Record<number, string> = {}
      suggestions.forEach((s) => (reasons[s.movie.id] = s.reason))
      setSuggestionReasons(reasons)
      setTotalPages(0)
      setPage(1)
      setCurrentApiFilters(null)
    } catch (e) {
      setDiscoverError('Não foi possível sugerir agora. Tente novamente.')
    } finally {
      setIsDiscoverLoading(false)
    }
  }

  return (
    <div className="container px-4 pt-28 min-h-screen animate-fade-in-up">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-1">
          Descubra Filmes
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-secondary">
          Use os filtros para encontrar exatamente o que você quer assistir.
        </p>
      </header>

      <section id="discover-section" className="container px-4 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {vibes.map((v, i) => (
            <Button
              key={v.label}
              variant="outline"
              className="rounded-full border-accent-1 text-accent-1 hover:bg-accent-1/10"
              onClick={() => onVibeClick(i)}
            >
              {v.label}
            </Button>
          ))}
          <Button
            variant="default"
            className="rounded-full bg-accent-1 text-primary-foreground hover:bg-accent-1/80"
            onClick={decideForMe}
            disabled={isDiscoverLoading}
          >
            {isDiscoverLoading ? 'Decidindo…' : 'Decida por mim'}
          </Button>
        </div>
        <div className="bg-card p-6 md:p-8 rounded-lg border border-accent-1/10 mb-12 glassmorphism">
          <h2 className="text-3xl font-bold mb-6 text-accent-1/90">Filtros</h2>
          <form
            onSubmit={handleDiscover}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end"
          >
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="genre-select"
                className="text-sm font-semibold text-secondary"
              >
                Gênero
              </Label>
              <Select
                onValueChange={(value) => handleFilterChange('genre', value)}
              >
                <SelectTrigger
                  id="genre-select"
                  className="bg-background border-accent-1/20"
                >
                  <SelectValue placeholder="Selecione um gênero" />
                </SelectTrigger>
                <SelectContent className="bg-card border-accent-1/20">
                  {genres.map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="year-input"
                className="text-sm font-semibold text-secondary"
              >
                Ano
              </Label>
              <Input
                id="year-input"
                type="number"
                placeholder="Ex: 2023"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="bg-background border-accent-1/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="director-input"
                className="text-sm font-semibold text-secondary"
              >
                Diretor
              </Label>
              <Input
                id="director-input"
                type="text"
                placeholder="Ex: Christopher Nolan"
                value={filters.director}
                onChange={(e) => handleFilterChange('director', e.target.value)}
                className="bg-background border-accent-1/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="age-rating-select"
                className="text-sm font-semibold text-secondary"
              >
                Classificação Indicativa
              </Label>
              <Select
                onValueChange={(value) =>
                  handleFilterChange('certification', value)
                }
              >
                <SelectTrigger
                  id="age-rating-select"
                  className="bg-background border-accent-1/20"
                >
                  <SelectValue placeholder="Todas as idades" />
                </SelectTrigger>
                <SelectContent className="bg-card border-accent-1/20">
                  {ageRatings.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Novos Filtros Avançados */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="country-select"
                className="text-sm font-semibold text-secondary"
              >
                País de Origem
              </Label>
              <Select
                onValueChange={(value) => handleFilterChange('country', value)}
              >
                <SelectTrigger
                  id="country-select"
                  className="bg-background border-accent-1/20"
                >
                  <SelectValue placeholder="Todos os países" />
                </SelectTrigger>
                <SelectContent className="bg-card border-accent-1/20">
                  {countries.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="decade-select"
                className="text-sm font-semibold text-secondary"
              >
                Década
              </Label>
              <Select
                onValueChange={(value) => handleFilterChange('decade', value)}
              >
                <SelectTrigger
                  id="decade-select"
                  className="bg-background border-accent-1/20"
                >
                  <SelectValue placeholder="Todas as décadas" />
                </SelectTrigger>
                <SelectContent className="bg-card border-accent-1/20">
                  {decades.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-secondary">
                Duração (minutos)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="min-duration"
                  type="number"
                  placeholder="Mín"
                  value={filters.minDuration}
                  onChange={(e) => handleFilterChange('minDuration', e.target.value)}
                  className="bg-background border-accent-1/20 w-1/2"
                  min="0"
                />
                <Input
                  id="max-duration"
                  type="number"
                  placeholder="Máx"
                  value={filters.maxDuration}
                  onChange={(e) => handleFilterChange('maxDuration', e.target.value)}
                  className="bg-background border-accent-1/20 w-1/2"
                  min="0"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 h-10 md:col-span-2 lg:col-span-3">
              <Button
                type="submit"
                disabled={isDiscoverLoading}
                className="bg-accent-1 text-primary-foreground hover:bg-accent-1/80 h-10 w-full"
              >
                {isDiscoverLoading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>
          </form>
        </div>

        {isDiscoverLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
            ))}
          </div>
        )}
        {discoverError && (
          <p className="text-center text-destructive">{discoverError}</p>
        )}
        {!isDiscoverLoading && (
          <div>
            {discoveredMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {discoveredMovies.map((movie, index) => (
                  <div
                    key={movie.id}
                    ref={
                      index === discoveredMovies.length - 1
                        ? lastElementRef
                        : null
                    }
                    className="relative"
                  >
                    {suggestionReasons[movie.id] && (
                      <div className="absolute top-2 left-2 z-10 text-[10px] px-2 py-1 rounded-full bg-accent-1/90 text-primary-foreground shadow">
                        Por que: {suggestionReasons[movie.id]}
                      </div>
                    )}
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            ) : (
              currentApiFilters && (
                <div className="text-center py-16">
                  <Film className="mx-auto h-16 w-16 text-secondary" />
                  <p className="mt-4 text-secondary">
                    Nenhum filme encontrado com os filtros selecionados.
                  </p>
                </div>
              )
            )}
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
            {!isMoreLoading &&
              discoveredMovies.length > 0 &&
              page > totalPages && (
                <p className="text-center text-secondary mt-8 font-semibold">
                  Você chegou ao fim dos resultados!
                </p>
              )}
          </div>
        )}
      </section>
    </div>
  )
}

export default DiscoverPage
