import { Link } from 'react-router-dom'
import { Star, Heart, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Movie } from '@/types'
import { cn } from '@/lib/utils'
import { getImageUrl } from '@/services/api'
import { WatchProvidersButton } from './WatchProvidersButton'
import { useLikesStore } from '@/stores/likes-store'
import { LazyImage } from './LazyImage'

interface MovieCardProps {
  movie: Movie
  className?: string
}

export const MovieCard = ({ movie, className }: MovieCardProps) => {
  const { toggleLike, isLiked } = useLikesStore()
  const liked = isLiked(movie.id)
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

  return (
    <Link to={`/filme/${movie.id}`} className="group block h-full">
      <Card
        className={cn(
          'overflow-hidden bg-card border-accent-1/10 transition-all duration-300 hover:scale-105 h-full',
          className,
        )}
      >
        <CardContent className="p-0 relative h-full">
          <img
            src={getImageUrl(movie.poster_path, 'w500')}
            srcSet={`${getImageUrl(movie.poster_path, 'w300')} 300w, ${getImageUrl(movie.poster_path, 'w500')} 500w, ${getImageUrl(movie.poster_path, 'w780')} 780w`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            alt={movie.title}
            className="aspect-[2/3] w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {movie.certification && (
            <Badge
              className={cn(
                'absolute top-2 right-2 text-xs font-bold border-0 z-10',
                getCertificationClass(movie.certification),
              )}
            >
              {movie.certification}
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white flex items-center justify-between gap-2">
            <h3 className="font-bold truncate text-foreground">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-sm">
                <Star className="w-4 h-4 text-accent-1 fill-accent-1 mr-1" />
                <span className="text-accent-1 font-semibold">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
              <button
                type="button"
                aria-label={liked ? 'Remover curtida' : 'Curtir'}
                onClick={(e) => {
                  e.preventDefault()
                  toggleLike(movie.id).catch(console.error)
                }}
                className={cn(
                  'p-1 rounded-full transition-colors',
                  liked
                    ? 'text-red-500 hover:text-red-400'
                    : 'text-white/80 hover:text-white',
                )}
              >
                <Heart className={cn('w-5 h-5', liked ? 'fill-red-500' : '')} />
              </button>
            </div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="outline"
              className="w-full border-accent-1 text-accent-1 bg-transparent hover:bg-accent-1/10 hover:text-accent-1"
            >
              Ver Detalhes
            </Button>
            <WatchProvidersButton
              movieId={movie.id}
              movieTitle={movie.title}
              variant="outline"
              className="w-full border-accent-1 text-accent-1 bg-transparent hover:bg-accent-1/10 hover:text-accent-1"
            />
            {movie.rating_note && (
              <div className="w-full text-left text-xs text-secondary/90 mt-1 flex items-start gap-1">
                <Info className="w-3 h-3 mt-0.5" />
                <span className="line-clamp-2">{movie.rating_note}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
