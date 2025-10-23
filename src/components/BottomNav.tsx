// COMPONENTE BOTTOMNAV - NAVEGAÇÃO INFERIOR PARA DISPOSITIVOS MÓVEIS
// Este componente exibe uma barra de navegação fixa na parte inferior da tela em dispositivos móveis

// IMPORTAÇÕES: Componentes de navegação e ícones
// Link = componente do React Router para navegação interna
// useLocation = hook para obter informações sobre a rota atual
import { Link, useLocation } from 'react-router-dom'
// Home, Search, Film, User = ícones da biblioteca Lucide React
import { Home, Search, Film, User } from 'lucide-react'
// cn = função utilitária para combinar classes CSS
import { cn } from '@/lib/utils'

// COMPONENTE BOTTOMNAV: Função que retorna a navegação inferior
export const BottomNav = () => {
  // HOOK: useLocation para obter informações da rota atual
  // location = objeto com informações sobre a rota atual (pathname, search, etc.)
  const location = useLocation()

  // ARRAY: Itens de navegação com suas configurações
  const navItems = [
    { path: '/', icon: Home, label: 'Início' },           // Página inicial
    { path: '/descobrir', icon: Film, label: 'Descobrir' }, // Página de descoberta
    { path: '/buscar', icon: Search, label: 'Buscar' },    // Página de busca
    { path: '/perfil', icon: User, label: 'Perfil' }       // Página de perfil
  ]

  // RETURN: JSX que será renderizado
  return (
    // NAV: Elemento semântico HTML para navegação
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      {/* CONTAINER: Container flexível para os itens de navegação */}
      <div className="flex justify-around py-2">
        {/* MAP: Itera sobre cada item de navegação */}
        {navItems.map(({ path, icon: Icon, label }) => (
          // LINK: Link de navegação para cada item
          <Link
            key={path}  // Chave única para cada item (necessário no React)
            to={path}   // Rota de destino
            // CLASSES: Classes CSS condicionais baseadas na rota atual
            className={cn(
              'flex flex-col items-center p-2 rounded-lg transition-colors',  // Classes base
              // Classes condicionais: ativo se a rota atual for igual ao path do item
              location.pathname === path
                ? 'text-accent-1 bg-accent-1/10'      // Estilo ativo (dourado com fundo)
                : 'text-secondary hover:text-foreground'  // Estilo inativo (cinza com hover)
            )}
          >
            {/* ÍCONE: Ícone do item de navegação */}
            <Icon className="w-5 h-5" />
            
            {/* LABEL: Texto descritivo do item */}
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
