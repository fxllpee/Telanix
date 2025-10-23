import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Star,
  PlayCircle,
  Plus,
  Check,
  Film,
  Clapperboard,
  Trash2,
} from 'lucide-react'
import {
  getMovieDetails,
  getSimilarMovies,
  getImageUrl,
  getProfileImageUrl,
} from '@/services/api'
import { MovieDetails as MovieDetailsType, Movie } from '@/types'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MovieCarousel } from '@/components/MovieCarousel'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useMovieStore } from '@/stores/movie-store'
import { WatchProvidersButton } from '@/components/WatchProvidersButton'
import { LoadingLogo } from '@/components/LoadingLogo'
import { useLikesStore } from '@/stores/likes-store'
import { UserRating } from '@/components/UserRating'
import { RatingStats } from '@/components/RatingStats'
import { useRatingsStore } from '@/stores/ratings-store'
import { AddReview } from '@/components/AddReview'
import { ReviewList } from '@/components/ReviewList'
import { useReviewsStore } from '@/stores/reviews-store'
import { TrailerPlayer } from '@/components/TrailerPlayer'

const MoviePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { removeMovie } = useMovieStore()
  const { toggleLike, isLiked } = useLikesStore()
  const { getRating, getRatedMoviesCount } = useRatingsStore()
  const { getReviewsByMovie } = useReviewsStore()
  const [movie, setMovie] = useState<MovieDetailsType | null>(null)
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return
      setIsLoading(true)
      setError(null)
      try {
        const movieDetails = await getMovieDetails(Number(id))
        setMovie(movieDetails)
        const similarMoviesData = await getSimilarMovies(Number(id))
        if (similarMoviesData && similarMoviesData.results) {
          setSimilarMovies(similarMoviesData.results)
        }
      } catch (err) {
        setError('Filme não encontrado ou falha ao carregar dados.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMovieData()
    window.scrollTo(0, 0)
  }, [id])

  const handleRemoveMovie = () => {
    if (movie) {
      try {
        removeMovie(movie.id)
        toast.success(`"${movie.title}" foi removido com sucesso.`)
        navigate('/')
      } catch (error) {
        toast.error('Não foi possível remover o filme. Tente novamente.')
        console.error('Failed to remove movie:', error)
      }
    }
  }

  const getCertificationClass = (cert?: string) => {
    if (!cert) return 'bg-gray-500 text-white'
    switch (cert) {
      case 'L':
        return 'bg-green-600 text-white'
      case '10':
        return 'bg-blue-500 text-white'
      case '12':
        return 'bg-yellow-500 text-black'
      case '14':
        return 'bg-orange-500 text-white'
      case '16':
        return 'bg-red-600 text-white'
      case '18':
        return 'bg-black text-white'
      default:
        return 'bg-gray-400 text-white'
    }
  }

  if (isLoading) {
    return <LoadingLogo />
  }

  if (error || !movie) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-accent-1 text-2xl">
        <Clapperboard className="w-16 h-16 mb-4" />
        {error}
      </div>
    )
  }

  const youtubeTrailers = movie.videos?.results.filter(
    (v) => v.type === 'Trailer' && v.site === 'YouTube',
  )

  const scoreTrailer = (v: typeof youtubeTrailers[number]) => {
    const name = (v.name || '').toLowerCase()
    let score = 0
    // prioriza PT-BR
    if (v.iso_639_1 === 'pt') score += 5
    if (name.includes('pt-br') || name.includes('português') || name.includes('portugues')) score += 4
    if (name.includes('dublado')) score += 3
    if (name.includes('legendado')) score += 2
    // resolução
    score += Math.min(2, Math.floor((v.size || 0) / 720)) // favorece 1080 > 720
    return score
  }

  const trailer = youtubeTrailers
    ?.slice()
    .sort((a, b) => scoreTrailer(b) - scoreTrailer(a))?.[0]
  const TRAILER_OVERRIDES: Record<number, string> = {
    155: 'EXeTwQWrcwY', // The Dark Knight (2008) - Official Trailer
  }
  const trailerKey = TRAILER_OVERRIDES[movie.id] || trailer?.key

  return (
    <div className="animate-fade-in-up">
      <section className="relative h-[60vh] md:h-[80vh] w-full">
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="relative z-10 container px-4 h-full flex flex-col justify-end pb-8 sm:pb-12 md:pb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold text-accent-1 leading-tight">
            {movie.title}
          </h1>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-2 sm:mt-4 text-sm sm:text-base text-secondary">
            <span>{new Date(movie.release_date).getFullYear()}</span>
            {movie.certification && (
              <>
                <span>&bull;</span>
                <Badge
                  className={cn(
                    'text-xs font-bold border-0',
                    getCertificationClass(movie.certification),
                  )}
                >
                  {movie.certification}
                </Badge>
              </>
            )}
            {movie.runtime && (
              <>
                <span>&bull;</span>
                <span>{movie.runtime} min</span>
              </>
            )}
            <span>&bull;</span>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-accent-1 fill-accent-1" />
              <span className="font-bold text-lg text-foreground">
                {movie.vote_average.toFixed(1)}/10
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-4">
            {movie.genres.map((g) => (
              <Badge
                key={g.id}
                variant="outline"
                className="border-accent-1 text-accent-1 text-xs sm:text-sm"
              >
                {g.name}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6 lg:mt-8">
            {trailerKey && (
              <TrailerPlayer 
                trailerKey={trailerKey}
                movieTitle={movie.title}
                autoplay={true}
              />
            )}
            <WatchProvidersButton
              movieId={movie.id}
              movieTitle={movie.title}
              size="lg"
              variant="outline"
              className="rounded-full border-accent-1 text-accent-1 px-3 sm:px-6 py-3 sm:py-5 font-semibold transition-all hover:bg-accent-1/10 hover:text-accent-1 text-sm sm:text-base"
            />
            <Button
              size="lg"
              variant={isLiked(movie.id) ? 'default' : 'outline'}
              className={cn(
                'rounded-full px-3 sm:px-6 py-3 sm:py-5 font-semibold transition-all text-sm sm:text-base',
                isLiked(movie.id)
                  ? 'bg-red-500 text-white hover:bg-red-500/90'
                  : 'border-secondary text-secondary hover:bg-secondary/10 hover:text-foreground hover:border-foreground',
              )}
              onClick={() => toggleLike(movie.id).catch(console.error)}
            >
              {isLiked(movie.id) ? (
                <>
                  <span className="hidden sm:inline">Curtido</span>
                  <span className="sm:hidden">❤️</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Curtir</span>
                  <span className="sm:hidden">🤍</span>
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-secondary text-secondary px-3 sm:px-6 py-3 sm:py-5 font-semibold transition-all hover:bg-secondary/10 hover:text-foreground hover:border-foreground text-sm sm:text-base"
            >
              <Plus className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
              <span className="hidden sm:inline">Adicionar à Lista</span>
              <span className="sm:hidden">Lista</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-secondary text-secondary px-3 sm:px-6 py-3 sm:py-5 font-semibold transition-all hover:bg-secondary/10 hover:text-foreground hover:border-foreground text-sm sm:text-base"
            >
              <Check className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
              <span className="hidden sm:inline">Marcar como Visto</span>
              <span className="sm:hidden">Visto</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="lg"
                  variant="destructive"
                  className="rounded-full px-3 sm:px-6 py-3 sm:py-5 font-semibold transition-all hover:bg-destructive/90 text-sm sm:text-base"
                >
                  <Trash2 className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
                  <span className="hidden sm:inline">Remover</span>
                  <span className="sm:hidden">🗑️</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-accent-1/20">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Você tem certeza absoluta?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. O filme será removido de
                    todas as listas e recomendações.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRemoveMovie}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Confirmar Remoção
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </section>

      <div className="container px-4 mt-8 sm:mt-12">
        <section className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-accent-1/90 mb-4">Sinopse</h2>
          <p className="text-secondary leading-relaxed text-sm sm:text-base">{movie.overview}</p>
        </section>

        <section className="mt-8 sm:mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-accent-1/90 mb-4 sm:mb-6">
            Avaliações
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <RatingStats 
              tmdbRating={movie.vote_average}
              userRating={movie ? getRating(movie.id) : null}
              totalUserRatings={getRatedMoviesCount()}
            />
            {movie && (
              <UserRating 
                movieId={movie.id}
                movieTitle={movie.title}
                className="justify-self-start md:justify-self-end"
              />
            )}
          </div>
        </section>

        <section className="mt-8 sm:mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-accent-1/90 mb-4 sm:mb-6">
            Elenco Principal
          </h2>
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {movie.credits.cast
              .filter(person => 
                person.name && 
                person.name.length > 2 &&
                !person.name.toLowerCase().includes('test') &&
                !person.name.toLowerCase().includes('fake') &&
                !person.name.toLowerCase().includes('demo') &&
                person.profile_path // Só mostrar pessoas com foto real
              )
              .slice(0, 10)
              .map((person) => (
                <div
                  key={person.id}
                  className="flex flex-col items-center text-center flex-shrink-0 w-20 sm:w-28"
                >
                  <Avatar className="w-16 h-16 sm:w-24 sm:h-24 border-2 border-accent-1/20">
                    <AvatarImage
                      src={getProfileImageUrl(person.profile_path)}
                      alt={person.name}
                    />
                    <AvatarFallback>
                      <Film className="w-6 h-6 sm:w-8 sm:h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold mt-2 text-foreground text-xs sm:text-sm truncate w-full">
                    {person.name}
                  </p>
                  <p className="text-secondary text-xs truncate w-full">{person.character}</p>
                </div>
              ))}
          </div>
        </section>

        <div className="mt-6 sm:mt-8">
          <MovieCarousel title="Filmes Semelhantes" movies={similarMovies} />
        </div>

        <section className="mt-12 sm:mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-accent-1/90 mb-4 sm:mb-6">
            Reviews da Comunidade
          </h2>
          <div className="mb-8">
            <ReviewList 
              movieId={movie.id}
              onEditReview={() => {
                // Scroll para o formulário de review
                const reviewForm = document.getElementById('add-review-form')
                reviewForm?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }}
            />
          </div>
        </section>

        <section id="add-review-form" className="mt-8 sm:mt-12 scroll-mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-accent-1/90 mb-4 sm:mb-6">
            Escreva Sua Review
          </h2>
          <AddReview 
            movieId={movie.id}
            movieTitle={movie.title}
            onReviewAdded={() => {
              // Scroll para o topo das reviews após publicar
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        </section>
      </div>
    </div>
  )
}

export default MoviePage

