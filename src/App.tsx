// COMPONENTE PRINCIPAL DA APLICAÇÃO - GERENCIA ROTAS E PROVEDORES
// Este arquivo define todas as rotas da aplicação e componentes globais

// IMPORTAÇÕES: Componentes do React Router para navegação
// BrowserRouter = permite navegação entre páginas usando URLs
// Routes = container para todas as rotas da aplicação
// Route = define uma rota específica (path + componente)
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// IMPORTAÇÕES: Componentes de notificação/toast
// Toaster = sistema de notificações padrão (shadcn/ui)
// Sonner = sistema de notificações alternativo (mais moderno)
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'

// IMPORTAÇÃO: Provedor de tooltips (dicas flutuantes)
// TooltipProvider = permite usar tooltips em toda a aplicação
import { TooltipProvider } from '@/components/ui/tooltip'

// IMPORTAÇÕES: Páginas da aplicação
import Index from './pages/Index'           // Página inicial (filmes populares)
import NotFound from './pages/NotFound'     // Página 404 (página não encontrada)
import Layout from './components/Layout'    // Layout principal (header, footer, etc.)
import MoviePage from './pages/Movie'       // Página de detalhes do filme
import SearchPage from './pages/Search'     // Página de busca de filmes
import ProfilePage from './pages/Profile'   // Página de perfil do usuário
import AboutPage from './pages/About'       // Página "Quem somos"
import DiscoverPage from './pages/Discover' // Página de descoberta de filmes
import SettingsPage from './pages/Settings' // Página de configurações

// REGRAS IMPORTANTES:
// - SÓ IMPORTE PÁGINAS QUE FUNCIONAM, NUNCA COMPONENTES PLACEHOLDER
// - NÃO REMOVA PROVEDORES DE CONTEXTO (TooltipProvider, Toaster, Sonner)

// COMPONENTE APP: Função principal que retorna a estrutura da aplicação
const App = () => (
  // BROWSERROUTER: Habilita navegação por URLs no navegador
  // future = configurações para versões futuras do React Router
  <BrowserRouter
    future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
  >
    {/* TOOLTIPPROVIDER: Permite usar tooltips em toda a aplicação */}
    <TooltipProvider>
      {/* TOASTER: Sistema de notificações padrão */}
      <Toaster />
      
      {/* SONNER: Sistema de notificações alternativo */}
      <Sonner />
      
      {/* ROUTES: Container para todas as rotas da aplicação */}
      <Routes>
        {/* ROTA COM LAYOUT: Todas as páginas dentro desta rota terão o layout padrão */}
        <Route element={<Layout />}>
          {/* ROTA INICIAL: Página principal (/) */}
          <Route path="/" element={<Index />} />
          
          {/* ROTA DO FILME: Página de detalhes do filme (/filme/123) */}
          <Route path="/filme/:id" element={<MoviePage />} />
          
          {/* ROTA DE BUSCA: Página de busca (/buscar) */}
          <Route path="/buscar" element={<SearchPage />} />
          
          {/* ROTA DE DESCOBERTA: Página de descoberta (/descobrir) */}
          <Route path="/descobrir" element={<DiscoverPage />} />
          
          {/* ROTA DE PERFIL: Página do perfil do usuário (/perfil) */}
          <Route path="/perfil" element={<ProfilePage />} />
          
          {/* ROTA DE CONFIGURAÇÕES: Página de configurações (/configuracoes) */}
          <Route path="/configuracoes" element={<SettingsPage />} />
          
          {/* ROTA REMOVIDA: Recomendações foi removida do sistema */}
          {/* rota de recomendações removida */}
          
          {/* ROTA "QUEM SOMOS": Página sobre a aplicação (/quem-somos) */}
          <Route path="/quem-somos" element={<AboutPage />} />
        </Route>
        
        {/* ROTA CATCH-ALL: Qualquer URL não encontrada vai para NotFound (*) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

// EXPORTAÇÃO: Exporta o componente App como padrão
export default App
