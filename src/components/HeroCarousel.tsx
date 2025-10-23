import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Autoplay from 'embla-carousel-autoplay'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { getPopularMovies, getMovieCertificationWithNote } from '@/services/api'
import { Movie } from '@/types'
import { HeroCarouselItem } from './HeroCarouselItem'
import { useTranslation } from '@/hooks/use-translation'
import { useContentFilters } from '@/hooks/use-content-filters'

const mockFeaturedMovies: Movie[] = [
  {
    id: 1022789,
    title: 'Duna: Parte Dois',
    overview:
      'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família. Enfrentando uma escolha entre o amor de sua vida e o destino do universo, ele deve evitar um futuro terrível que só ele pode prever.',
    poster_path: '/8b8R8l88Qje9dnFF6K9SmmZYVE1.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    release_date: '2024-02-27',
    vote_average: 8.3,
    genres: [
      { id: 878, name: 'Ficção científica' },
      { id: 12, name: 'Aventura' },
    ],
    runtime: 167,
    original_title: 'Dune: Part Two',
    original_language: 'en',
    vote_count: 3000,
  },
  {
    id: 693134,
    title: 'Godzilla e Kong: O Novo Império',
    overview:
      'Dois monstros gigantes, Godzilla e Kong, se unem para lutar contra uma ameaça colossal que se esconde dentro do nosso mundo, desafiando a sua própria existência e a nossa.',
    poster_path: '/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg',
    backdrop_path: '/tpiqEVTLRz2Yalsv6V02cI8aA6.jpg',
    release_date: '2024-03-27',
    vote_average: 7.2,
    genres: [{ id: 878, name: 'Ficção científica' }],
    runtime: 115,
    original_title: 'Godzilla x Kong: The New Empire',
    original_language: 'en',
    vote_count: 2000,
  },
  {
    id: 823464,
    title: 'Guerra Civil',
    overview:
      'Em um futuro próximo, uma equipe de jornalistas viaja pelos Estados Unidos durante uma guerra civil que se intensifica rapidamente e que envolveu toda a nação.',
    poster_path: '/oMiK4d4aPQ2deT2B5i2PSLIaY2G.jpg',
    backdrop_path: '/5Eip60K5y2k5yYos7blXlB1Q1J8.jpg',
    release_date: '2024-04-10',
    vote_average: 7.4,
    genres: [{ id: 10752, name: 'Guerra' }],
    runtime: 109,
    original_title: 'Civil War',
    original_language: 'en',
    vote_count: 1000,
  },
  {
    id: 940721,
    title: 'O Dublê',
    overview:
      'Um dublê que deixou a carreira para se concentrar em sua saúde física e mental é convocado de volta ao serviço quando a estrela de um filme de estúdio de grande orçamento desaparece.',
    poster_path: '/v3v00sB4E3eC04n9i2MS4s0sS47.jpg',
    backdrop_path: '/H5HjE7Xb9N09rbWn1zBfxgI8uz.jpg',
    release_date: '2024-04-24',
    vote_average: 7.5,
    genres: [{ id: 28, name: 'Ação' }],
    runtime: 126,
    original_title: 'The Fall Guy',
    original_language: 'en',
    vote_count: 800,
  },
  {
    id: 786892,
    title: 'Furiosa: Uma Saga Mad Max',
    overview:
      'Enquanto o mundo caía, a jovem Furiosa é sequestrada do Green Place das Muitas Mães e cai nas mãos de uma grande Horda de Motoqueiros liderada pelo Senhor da Guerra Dementus.',
    poster_path: '/iADOJ8Zymht2JPMoy3R7xceZprc.jpg',
    backdrop_path: '/mYJv5HrQyFkYgVp4iPzH0nL7lG.jpg',
    release_date: '2024-05-22',
    vote_average: 7.7,
    genres: [{ id: 878, name: 'Ficção científica' }],
    runtime: 148,
    original_title: 'Furiosa: A Mad Max Saga',
    original_language: 'en',
    vote_count: 500,
  },
  {
    id: 1011985,
    title: 'Planeta dos Macacos: O Reinado',
    overview:
      'Várias gerações no futuro, após o reinado de César, os macacos são agora a espécie dominante e vivem harmoniosamente, enquanto os humanos foram reduzidos a viver nas sombras.',
    poster_path: '/gKkl37BQuKTanygYQG1pyYgLVgf.jpg',
    backdrop_path: '/fqv8v6AycXKsivp1T5yKtLbIceh.jpg',
    release_date: '2024-05-08',
    vote_average: 7.3,
    genres: [{ id: 878, name: 'Ficção científica' }],
    runtime: 145,
    original_title: 'Kingdom of the Planet of the Apes',
    original_language: 'en',
    vote_count: 700,
  },
]

export const HeroCarousel = () => {
  const { t } = useTranslation()
  const { applyFilters } = useContentFilters()
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const plugin = useRef(Autoplay({ delay: 6000, stopOnInteraction: true }))

  useEffect(() => {
    if (import.meta.env.MODE === 'test') {
      setFeaturedMovies(mockFeaturedMovies)
      setIsLoading(false)
      return
    }

    const fetchFeatured = async () => {
      try {
        // Buscar múltiplas páginas para ter mais opções
        const [data1, data2] = await Promise.all([
          getPopularMovies(1),
          getPopularMovies(2)
        ])
        const popularMovies = [...(data1?.results || []), ...(data2?.results || [])]

        if (popularMovies.length === 0) {
          setFeaturedMovies(mockFeaturedMovies)
          return
        }

        const highRatedMovie = popularMovies.find((m) => m.vote_average > 7.5)
        const finalMovies: Movie[] = []

        if (highRatedMovie) {
          finalMovies.push(highRatedMovie)
          const otherMovies = popularMovies.filter(
            (m) => m.id !== highRatedMovie.id,
          )
          finalMovies.push(...otherMovies.slice(0, 8)) // Aumentado de 5 para 8
        } else {
          finalMovies.push(...popularMovies.slice(0, 9)) // Aumentado de 6 para 9
        }

        if (finalMovies.length < 9 && popularMovies.length >= 9) {
          const existingIds = new Set(finalMovies.map((m) => m.id))
          const needed = 9 - finalMovies.length
          const fallbackMovies = popularMovies
            .filter((m) => !existingIds.has(m.id))
            .slice(0, needed)
          finalMovies.push(...fallbackMovies)
        }

        // fetch Brazilian certification for each movie
        const moviesWithCert = await Promise.all(
          finalMovies.map(async (m) => {
            try {
              const { certification, note } = await getMovieCertificationWithNote(m.id)
              return { ...m, certification: certification || undefined, rating_note: note || undefined }
            } catch {
              return m
            }
          }),
        )

        setFeaturedMovies(moviesWithCert)
      } catch (error) {
        console.error('Failed to fetch featured movies:', error)
        setFeaturedMovies(mockFeaturedMovies)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  if (isLoading) {
    return <Skeleton className="h-screen w-full" />
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{
        loop: true,
      }}
      className="w-full h-screen"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        <CarouselItem>
          <div className="relative h-screen w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-black to-zinc-900 animate-slow-pan" />
            <div className="relative z-10 flex h-full items-center justify-center text-center">
              <div className="container max-w-4xl px-4 animate-fade-in-up">
                <h1 className="text-6xl md:text-8xl font-extrabold text-accent-1">
                  Telanix
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-secondary">
                  O Futuro do Cinema na Sua Tela.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <Link to="/descobrir">
                    <Button
                      size="lg"
                      className="rounded-full bg-accent-1 text-primary-foreground px-8 py-6 text-lg font-semibold transition-all hover:bg-accent-1/80"
                    >
                      {t('hero.discoverNow')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CarouselItem>
        {featuredMovies.map((movie) => (
          <CarouselItem key={movie.id}>
            <HeroCarouselItem movie={movie} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-accent-1 border-accent-1 bg-background/50 hover:bg-accent-1/10 hover:text-accent-1" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-accent-1 border-accent-1 bg-background/50 hover:bg-accent-1/10 hover:text-accent-1" />
    </Carousel>
  )
}
