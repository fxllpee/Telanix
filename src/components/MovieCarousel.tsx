import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { MovieCard } from './MovieCard'
import { Movie } from '@/types'

interface MovieCarouselProps {
  title: string
  movies: Movie[]
}

export const MovieCarousel = ({ title, movies }: MovieCarouselProps) => {
  if (!movies || movies.length === 0) {
    return null
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-6 text-accent-1/90">{title}</h2>
      <Carousel
        opts={{
          align: 'start',
          loop: movies.length > 8,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {movies.map((movie) => (
            <CarouselItem
              key={movie.id}
              className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/7 2xl:basis-1/8"
            >
              <MovieCard movie={movie} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex text-accent-1 border-accent-1 hover:bg-accent-1/10 hover:text-accent-1" />
        <CarouselNext className="hidden md:flex text-accent-1 border-accent-1 hover:bg-accent-1/10 hover:text-accent-1" />
      </Carousel>
    </section>
  )
}
