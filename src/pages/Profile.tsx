import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MovieCard } from '@/components/MovieCard'
import { getPopularMovies, getNowPlayingMovies, getMovieDetailsBatch } from '@/services/api'
import { Movie } from '@/types'
// removed chart imports due to type issues in current environment
import { useLikesStore } from '@/stores/likes-store'
import { useAuthStore } from '@/stores/auth-store'
import { useRatingsStore } from '@/stores/ratings-store'
import { useReviewsStore } from '@/stores/reviews-store'
import { Input } from '@/components/ui/input'
import { Star, BarChart3, MessageSquare } from 'lucide-react'

// chart removed

const ProfilePage = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([])
  const [watchedHistory, setWatchedHistory] = useState<Movie[]>([])
  const [likedMovies, setLikedMovies] = useState<Movie[]>([])
  const { likedMovieIds, loadUserLikes } = useLikesStore()
  const { user, updateProfile } = useAuthStore()
  const { getUserAverageRating, getRatedMoviesCount } = useRatingsStore()
  const { getUserReviewsCount } = useReviewsStore()
  const [name, setName] = useState(user?.name || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '')
  const [bio, setBio] = useState(user?.bio || '')

  useEffect(() => {
    setName(user?.name || '')
    setAvatarUrl(user?.avatarUrl || '')
    setBio(user?.bio || '')
    
    // Carregar likes do usuário quando o usuário mudar
    if (user?.id) {
      loadUserLikes(user.id)
    }
  }, [user, loadUserLikes])

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const popular = await getPopularMovies()
        if (popular && popular.results) {
          setWatchlist(popular.results.slice(0, 6))
        }
        const nowPlaying = await getNowPlayingMovies()
        if (nowPlaying && nowPlaying.results) {
          setWatchedHistory(nowPlaying.results.slice(0, 6))
        }
        // Buscar detalhes pelos IDs curtidos para garantir consistência
        if (likedMovieIds.length > 0) {
          const liked = await getMovieDetailsBatch(likedMovieIds)
          setLikedMovies(liked)
        } else {
          setLikedMovies([])
        }
      } catch (error) {
        console.error('Failed to fetch profile lists:', error)
      }
    }
    fetchLists()
  }, [likedMovieIds])

  return (
    <div className="container px-4 pt-28 min-h-screen animate-fade-in-up">
      <section className="flex flex-col md:flex-row items-center gap-6 mb-16">
        <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-accent-1">
          <AvatarImage src={avatarUrl || 'https://img.usecurling.com/ppl/large'} />
          <AvatarFallback>{(user?.name || 'U').charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="w-full max-w-xl">
          <h1 className="text-3xl md:text-4xl font-bold">Olá, {user?.name || 'Usuário'}!</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <Input placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="URL do avatar" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
            <Input placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <Button
            onClick={() => updateProfile({ name, avatarUrl, bio })}
            variant="outline"
            className="mt-4 border-accent-1 text-accent-1 hover:bg-accent-1/10 hover:text-accent-1"
          >
            Salvar Perfil
          </Button>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-accent-1/90">Suas Estatísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-accent-1/20 rounded-lg p-6 text-center">
            <Star className="w-8 h-8 text-accent-1 mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-1">
              {getRatedMoviesCount()}
            </div>
            <div className="text-secondary">Filmes Avaliados</div>
          </div>
          <div className="bg-card border border-accent-1/20 rounded-lg p-6 text-center">
            <BarChart3 className="w-8 h-8 text-accent-1 mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-1">
              {getUserAverageRating().toFixed(1)}
            </div>
            <div className="text-secondary">Média das Suas Avaliações</div>
          </div>
          <div className="bg-card border border-accent-1/20 rounded-lg p-6 text-center">
            <MessageSquare className="w-8 h-8 text-accent-1 mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-1">
              {user ? getUserReviewsCount(user.id) : 0}
            </div>
            <div className="text-secondary">Reviews Escritas</div>
          </div>
          <div className="bg-card border border-accent-1/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-accent-1 mb-1">❤️</div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {likedMovies.length}
            </div>
            <div className="text-secondary">Filmes Curtidos</div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-accent-1/90">Filmes Curtidos</h2>
        {likedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {likedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="text-secondary">Você ainda não curtiu nenhum filme.</p>
        )}
      </section>

      <section id="minha-lista" className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-accent-1/90">
          Minha Lista
        </h2>
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="text-secondary">
            Sua lista está vazia. Comece a explorar!
          </p>
        )}
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-accent-1/90">
          Histórico de Visualização
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {watchedHistory.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-accent-1/90">Seu Perfil de Filme</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg border border-accent-1/10">
            <p className="text-secondary">Curtidos</p>
            <p className="text-3xl font-bold">{likedMovies.length}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border border-accent-1/10">
            <p className="text-secondary">Minha Lista</p>
            <p className="text-3xl font-bold">{watchlist.length}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border border-accent-1/10">
            <p className="text-secondary">Histórico</p>
            <p className="text-3xl font-bold">{watchedHistory.length}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfilePage
