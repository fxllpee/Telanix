// PÁGINA INICIAL DA APLICAÇÃO - EXIBE FILMES POPULARES, EM CARTAZ E MAIS AVALIADOS
// Esta é a página principal que os usuários veem quando acessam a aplicação

// IMPORTAÇÕES: Hooks do React para gerenciamento de estado e efeitos
// useRef = hook para referenciar elementos DOM
// useEffect = hook para executar efeitos colaterais
// useState = hook para gerenciar estado local
import { useRef, useEffect, useState } from 'react'

// IMPORTAÇÕES: Componentes da aplicação
// MovieCarousel = carrossel de filmes (lista horizontal de filmes)
import { MovieCarousel } from '@/components/MovieCarousel'
// HeroCarousel = carrossel principal no topo da página (destaque)
import { HeroCarousel } from '@/components/HeroCarousel'

// IMPORTAÇÕES: Hooks customizados
// useOnScreen = hook para detectar se elemento está visível na tela
import { useOnScreen } from '@/hooks/use-on-screen'
// useTranslation = hook para tradução/internacionalização
import { useTranslation } from '@/hooks/use-translation'
// useContentFilters = hook para filtros de conteúdo (idade, classificação)
import { useContentFilters } from '@/hooks/use-content-filters'

// IMPORTAÇÕES: Utilitários e serviços
// cn = função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'
// Serviços da API do TMDB para buscar filmes
import {
  getPopularMovies,      // Busca filmes populares
  getNowPlayingMovies,   // Busca filmes em cartaz
  getTopRatedMovies,     // Busca filmes mais avaliados
} from '@/services/api'
// Movie = interface TypeScript que define a estrutura de um filme
import { Movie } from '@/types'

// DADOS MOCK: Filme fictício usado em testes
// Este objeto representa um filme completo com todas as propriedades necessárias
const mockFeaturedMovie: Movie = {
  id: 1022789,  // ID único do filme no TMDB
  title: 'Duna: Parte Dois',  // Título do filme em português
  overview: 'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família. Enfrentando uma escolha entre o amor de sua vida e o destino do universo, ele deve evitar um futuro terrível que só ele pode prever.',  // Sinopse do filme
  poster_path: '/8b8R8l88Qje9dnFF6K9SmmZYVE1.jpg',  // Caminho para o poster do filme
  backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',  // Caminho para a imagem de fundo
  release_date: '2024-02-27',  // Data de lançamento
  vote_average: 8.3,  // Média de avaliações (0-10)
  genres: [  // Array de gêneros do filme
    { id: 878, name: 'Ficção científica' },  // Darama com ID e nome
    { id: 12, name: 'Aventura' },           // Drama com ID e nome
  ],
  runtime: 167,  // Duração em minutos
  original_title: 'Dune: Part Two',  // Título original (em inglês)
  original_language: 'en',  // Idioma original
  vote_count: 3000,  // Número total de avaliações
}

// COMPONENTE INDEXPAGE: Função principal da página inicial
const IndexPage = () => {
  // HOOKS: Hooks customizados para funcionalidades específicas
  // useTranslation = hook para tradução de textos
  const { t } = useTranslation()
  // useContentFilters = hook para aplicar filtros de conteúdo
  const { applyFilters } = useContentFilters()

  // ESTADO: Estados locais para armazenar listas de filmes
  // useState = hook para gerenciar estado local
  const [popularMovies, setPopularMovies] = useState<Movie[]>([])      // Lista de filmes populares
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]) // Lista de filmes em cartaz
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([])     // Lista de filmes mais avaliados

  // EFEITO: useEffect para buscar filmes quando o componente é montado
  // useEffect = executa código quando o componente é montado ou quando dependências mudam
  useEffect(() => {
    // MODO TESTE: Se estiver em modo de teste, usa dados mock
    if (import.meta.env.MODE === 'test') {
      setPopularMovies([mockFeaturedMovie])      // Define filmes populares com dados mock
      setNowPlayingMovies([mockFeaturedMovie])   // Define filmes em cartaz com dados mock
      setTopRatedMovies([mockFeaturedMovie])     // Define filmes mais avaliados com dados mock
      return  // Sai da função sem fazer requisições reais
    }

    // FUNÇÃO ASSÍNCRONA: Busca filmes da API do TMDB
    const fetchMovies = async () => {
      try {
        // BUSCAR FILMES POPULARES (múltiplas páginas para mais filmes)
        const [popular1, popular2] = await Promise.all([
          getPopularMovies(1),
          getPopularMovies(2)
        ])
        const allPopular = [...(popular1?.results || []), ...(popular2?.results || [])]
        if (allPopular.length > 0) {
          setPopularMovies(applyFilters(allPopular))
        }
        
        // BUSCAR FILMES EM CARTAZ (múltiplas páginas para mais filmes)
        const [nowPlaying1, nowPlaying2] = await Promise.all([
          getNowPlayingMovies(1),
          getNowPlayingMovies(2)
        ])
        const allNowPlaying = [...(nowPlaying1?.results || []), ...(nowPlaying2?.results || [])]
        if (allNowPlaying.length > 0) {
          setNowPlayingMovies(applyFilters(allNowPlaying))
        }
        
        // BUSCAR FILMES MAIS AVALIADOS (múltiplas páginas para mais filmes)
        const [topRated1, topRated2] = await Promise.all([
          getTopRatedMovies(1),
          getTopRatedMovies(2)
        ])
        const allTopRated = [...(topRated1?.results || []), ...(topRated2?.results || [])]
        if (allTopRated.length > 0) {
          setTopRatedMovies(applyFilters(allTopRated))
        }
      } catch (error) {
        // TRATAMENTO DE ERRO: Registra erro no console se falhar
        console.error('Failed to fetch movies for homepage:', error)
      }
    }
    fetchMovies()  // Executa a função de busca
  }, [applyFilters])  // DEPENDÊNCIA: Executa quando applyFilters muda

  // REFS: Referências para elementos DOM (usadas para animações)
  // useRef = hook para referenciar elementos DOM
  const topRatedRef = useRef<HTMLDivElement>(null)      // Ref para seção de filmes mais avaliados
  const popularRef = useRef<HTMLDivElement>(null)       // Ref para seção de filmes populares
  const nowPlayingRef = useRef<HTMLDivElement>(null)    // Ref para seção de filmes em cartaz

  // VISIBILIDADE: Detecta se as seções estão visíveis na tela (para animações)
  // useOnScreen = hook customizado para detectar visibilidade
  const isTopRatedVisible = useOnScreen(topRatedRef, '-100px')      // Detecta se seção topRated está visível
  const isPopularVisible = useOnScreen(popularRef, '-100px')        // Detecta se seção popular está visível
  const isNowPlayingVisible = useOnScreen(nowPlayingRef, '-100px')  // Detecta se seção nowPlaying está visível

  // RETURN: JSX que será renderizado na tela
  return (
    <>
      {/* HERO CAROUSEL: Carrossel principal no topo da página */}
      <HeroCarousel />
      
      {/* MAIN: Conteúdo principal da página */}
      <main id="main-content-section">
        {/* SEÇÃO FILMES MAIS AVALIADOS */}
        <div
          ref={topRatedRef}  // Ref para detectar visibilidade
          className={cn(  // cn = função para combinar classes CSS
            'container px-4',  // Container com padding horizontal
            isTopRatedVisible ? 'animate-fade-in-up' : 'opacity-0',  // Animação baseada na visibilidade
          )}
        >
          <MovieCarousel title={t('carousel.topMovies')} movies={topRatedMovies} />
        </div>
        
        {/* SEÇÃO FILMES POPULARES */}
        <div
          ref={popularRef}  // Ref para detectar visibilidade
          className={cn(  // cn = função para combinar classes CSS
            'container px-4',  // Container com padding horizontal
            isPopularVisible ? 'animate-fade-in-up' : 'opacity-0',  // Animação baseada na visibilidade
          )}
        >
          <MovieCarousel title={t('carousel.popular')} movies={popularMovies} />
        </div>
        
        {/* SEÇÃO FILMES EM CARTAZ */}
        <div
          ref={nowPlayingRef}  // Ref para detectar visibilidade
          className={cn(  // cn = função para combinar classes CSS
            'container px-4',  // Container com padding horizontal
            isNowPlayingVisible ? 'animate-fade-in-up' : 'opacity-0',  // Animação baseada na visibilidade
          )}
        >
          <MovieCarousel title={t('carousel.nowPlaying')} movies={nowPlayingMovies} />
        </div>
      </main>
    </>
  )
}

// EXPORTAÇÃO: Exporta o componente como padrão
export default IndexPage
