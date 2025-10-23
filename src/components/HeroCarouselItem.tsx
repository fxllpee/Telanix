import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { getImageUrl } from '@/services/api'
import { Movie } from '@/types'

interface HeroCarouselItemProps {
  movie: Movie
}

export const HeroCarouselItem = ({ movie }: HeroCarouselItemProps) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <img
        src={getImageUrl(movie.backdrop_path, 'original')}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="relative z-10 flex h-full items-center justify-center text-center">
        <div className="container max-w-4xl px-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-accent-1 leading-tight">
            {movie.title}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-secondary">
            {movie.overview}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to={`/filme/${movie.id}`}>
              <Button
                size="lg"
                className="rounded-full bg-accent-1 text-primary-foreground px-8 py-6 text-lg font-semibold transition-all hover:bg-accent-1/80"
              >
                Ver Detalhes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
